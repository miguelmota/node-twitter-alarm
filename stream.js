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

t.stream(
    'statuses/filter',
    { track: ['node.js'] },
    function(stream) {
        stream.on('data', function(tweet) {
            var letweet = {
              date: tweet.created_at,
              text: tweet.text,
              from: tweet.user.name,
              from_screen_name: tweet.user.screen_name
            };
            
            console.log(letweet);
        });
    }
);
