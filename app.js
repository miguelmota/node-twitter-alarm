var fs = require('fs');
var lame = require('lame');
var lameDecoder = new lame.Decoder;
var Speaker = require('speaker');
var soundFile = 'media/tsunami.mp3';
var OAuth2 = require('oauth').OAuth2;

var twitter = {
  consumerKey: 'sm6FKq6fMTE7fW9EQEQ',
  consumerSecret: 'UgCSx1h2biJaJLc2l478ZRIPyvlbmdmNnGQdfDRlyM'
};

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

    var http = require('https');
                                                                                                                                                                                                              
    var options = { 
      host: 'api.twitter.com',
      port: 443,
      path: '/1.1/statuses/user_timeline.json?screen_name=_moogs&count=10',
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    };

    var request = http.request(options, function (res) {
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

var playAudio = function () {
  fs.createReadStream(soundFile)
    .pipe(lameDecoder)
    .on('format', function(format) {
      this.pipe(new Speaker(format));
  });
};

playAudio();
