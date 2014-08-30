var fs = require('fs');
var lame = require('lame');
var Speaker = require('speaker');
var _ = require('lodash');
var clc = require('cli-color');
var moment = require('moment');
var argv = require('minimist')(process.argv.slice(2));
var twitter = require('ntwitter');
var config = require('./config.json');

function audio(filename) {
    fs.createReadStream(filename)
    .pipe(new lame.Decoder)
    .on('format', function(format) {
        this.pipe(new Speaker(format));
    });
}

function format(tweet) {
    return {
        date: moment(Date.parse(tweet.created_at)),
        text: tweet.text,
        from: tweet.user.name,
        from_screen_name: tweet.user.screen_name
    };
}

function highlight(str, ary) {
    return _.reduce(ary, function(acc, item, i) {
        return acc.replace(new RegExp(item, 'gi'), clc.yellow(item));
    }, str);
}

var opts = _.extend(config.defaults, !_.isEmpty(argv._) ? {track: argv._} : {});

(new twitter(config.twitter)).stream(
    'statuses/filter',
    _.clone(opts),
    function(stream) {

        console.log('Listening for tweets matching:', clc.yellow(opts.track), '\n');

        stream.on('data', function(tweet) {
            if (/RT/.test(tweet.text)) return false;

            tweet = format(tweet);
            tweet.text = highlight(tweet.text, opts.track);
            tweet.toString = function() {
                return [clc.magenta('>'), clc.blue('@' + tweet.from_screen_name), ':', tweet.text, clc.cyan(tweet.date)].join(' ');
            };

            console.log(tweet.toString(), '\n');

            _.has(config.notifications, 'filename') && audio(config.notifications.filename);
        });
    }
);
