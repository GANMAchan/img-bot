'use strict';
const Twit = require('twit');
const cron = require('cron').CronJob;
const fs = require('fs');

const twitter = new Twit({
    //環境変数のAPIを読み込み
    consumer_key: process.env.TWITTER_API_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_API_CONSUMER_SECRET,
    access_token: process.env.TWITTER_API_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_API_ACCESS_TOKEN_SECRET
});

//imgフォルダの画像のファイル名をpictureNumの値に対応させる
var pictureNum = [1,2,3,4,5,6,7,8,9,10];
var randomPictureNum = pictureNum[Math.floor(Math.random() * pictureNum.length)];

function tweetImg() {
    //画像の読み込み
    const imgData = fs.readFileSync('img/' + randomPictureNum + '.jpg', { encoding: 'base64' }); //投稿画像

    //読み込んだ画像のアップロード
    twitter.post('media/upload', { media_data: imgData }, function (err, tweets, response) {
        var mediaIdStr = tweets.media_id_string;
        var altText = 'ラーメン画像';
        var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } };

        twitter.post('media/metadata/create', meta_params, function (error, tweets, response) {
            if (!error) {
                var params = {
                    status: '',
                    media_ids: [mediaIdStr]
                };
                twitter.post('statuses/update', params, function (error, tweets, response) {
                    console.log(tweets);
                });
            }
        });
    });
};

const cronJob = new cron({
    cronTime: '00 0 * * *', //毎日0時に実行
    start: true, // newした後即時実行するかどうか
    onTick: function(){
        tweetImg();
    }
});
tweetImg();