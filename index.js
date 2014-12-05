var fs = require('fs');
var path = require('path');
var lame = require('lame');
var Speaker = require('speaker');
var _ = require('lodash');
var clc = require('cli-color');
var moment = require('moment');
var argv = require('minimist')(process.argv.slice(2));
var twitter = require('twitter');

var configFile = './config.json';
var globalConfigFile = path.resolve('~/.twitter-alarm/' + configFile);
var config;

fs.exists(globalConfigFile, function(exists) {
  if (exists) {
    configFile = globalConfigFile;
  }
  init();
});

function audio(filename) {
  fs.createReadStream(filename)
  .pipe(new lame.Decoder)
  .on('format', function(format) {
    this.pipe(new Speaker(format));
  });
}

function highlight(str, ary) {
  return _.reduce(ary, function(acc, item, i) {
    return acc.replace(new RegExp(item, 'gi'), clc.yellow(item));
  }, str);
}

function init() {
  config = require(configFile);
  var opts = _.extend(config.defaults, !_.isEmpty(argv._) ? {track: argv._} : {});

  var playNotfication = _.throttle(function() {
    if (_.has(config.notifications, 'filename')) {
      audio(config.notifications.filename);
    }
  }, 1000);

  var T = (new twitter(config.twitter));

  T.stream(
    'statuses/filter',
    _.clone(opts),
    function(stream) {

      process.stdout.write('Listening for tweets matching: ' + clc.yellow(opts.track) + '\n\n');

      stream.on('data', function(tweet) {

        if (/RT/.test(tweet.text)) return false;

        var output = [
          clc.green('>'),
          clc.cyan('@' + tweet.user.screen_name), ':',
          highlight(tweet.text, opts.track),
          clc.cyan(moment(Date.parse(tweet.created_at)))
          ].join(' ');

          var replyStatusId = tweet.in_reply_to_status_id_str;
          if (replyStatusId) {
            T.get('/statuses/show/' + replyStatusId + '.json', function(rtweet, res) {
              if (rtweet && rtweet.user) {
                output = output.concat([
                  '\n\t' + clc.green(String.fromCharCode(0x21B3)),
                  clc.cyan('@'+ rtweet.user.screen_name), ':',
                  highlight(rtweet.text, opts.track),
                  clc.cyan(moment(Date.parse(rtweet.created_at)))
                ].join(' '));
              }
              process.stdout.write(output + '\n\n');
            })
          } else {
            process.stdout.write(output + '\n\n');
          }
          playNotfication();
      });
    }
  );

}
