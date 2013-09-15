var https = require('https');
var http = require('http');
var fs = require('fs');
var lame = require('lame');
var Speaker = require('speaker');
var soundFile = 'media/sounds-917-communication-channel.mp3';
var OAuth2 = require('oauth').OAuth2;
var say = require('say');
var clc = require('cli-color');


http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('hello');
}).listen(3000);

console.log(new Date().toISOString() + '\n');
console.log('Listening on port 3000');

var twitter = {
  consumerKey: 'sm6FKq6fMTE7fW9EQEQ',
  consumerSecret: 'UgCSx1h2biJaJLc2l478ZRIPyvlbmdmNnGQdfDRlyM'
};

/*
var oauth2 = new OAuth2(
    twitter.consumerKey,
    twitter.consumerSecret,
    'https://api.twitter.com/',
    null,
    'oauth2/token',
    null   
);

oauth2.getOAuthAccessToken(
  '',
  {'grant_type': 'client_credentials'},
  function (e, access_token, refresh_token, results) {
    console.log('bearer:', access_token);

                                                                                                                                                                                                              
    var options = { 
      host: 'api.twitter.com',
      port: 443,
      path: '/1.1/search/tweets.json?q=%40_moogs',
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    };

    var request = https.request(options, function (res) {
      var output = ''; 

      res.on('data', function (chunk) {
        output += chunk;
      }); 

      res.on('end', function () {
        var tweets = JSON.parse(output);
        console.log(tweets); 
     }); 
 
    });
   
    request.end();

  }
);
*/

var playAudio = function () {
  fs.createReadStream(soundFile)
    .pipe(new lame.Decoder)
    .on('format', function(format) {
      this.pipe(new Speaker(format));
  });
};



var credentials = {
    consumer_key: 'your consumer key here',
    consumer_secret: 'your consumer secret here',
    access_token_key: 'your access token key here',
    access_token_secret: 'your access token secret here'
};

var twitter = require('ntwitter');

var t = new twitter({
    consumer_key: 'sm6FKq6fMTE7fW9EQEQ',
    consumer_secret: 'UgCSx1h2biJaJLc2l478ZRIPyvlbmdmNnGQdfDRlyM',
    access_token_key: '30783806-otSQz5WbOAtsY4LX4IMNj1jkZIxfZD6cCHm9AV450',
    access_token_secret: 'RFrOUegHfHAXYZtaFmZVe5oWAheEmeWNRqgbeSM'
});
var track = ['@_moogs'];

if (process.argv[2]) {
  track = process.argv.splice(2);
}

var voice = false;
var sound = true;

t.stream(
    'statuses/filter',
    { track: track },
    function(stream) {
        console.log('Listening for tweets matching:', clc.yellow(track) + '\n');
        stream.on('data', function(tweet) {
          if (/RT/.test(tweet.text)) {
            return false;
          }
            var letweet = {
              date: tweet.created_at,
              text: tweet.text,
              from: tweet.user.name,
              from_screen_name: tweet.user.screen_name
            };
          
            var text = clc.green.bgBlack(letweet.text); 
            track.forEach(function(item, i) {
              var re = new RegExp(item, 'gi');
              text = text.replace(re, clc.yellow(item));
            });
  
          console.log(clc.magenta('>') + ' ' + clc.blue('@' + letweet.from_screen_name) + ': ' + text + ' ' + clc.cyan(letweet.date)  + '\n');
          if (sound) {
            playAudio();
          }
          if (voice) {
            say.speak('voice_cmu_us_clb_arctic_clunits', letweet.text, function() {
              //-
            });
          }
        });
    }
);
