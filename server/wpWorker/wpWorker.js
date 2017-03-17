'use strict';
var exports = module.exports = {};

const http = require('http');

const Converter = require('../converter/converter');
const Images = require('../converter/dataGenerator/imageWorker');
const Config = require('../config.js');

const wpWorker = () => {
    let allImagesInfo = [];

    function getPagesFromWP() {
        http.get(Config.STAGING_URL + Config.POSTS_URL, (res) => {
            let body = "";
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                Converter.creatingSiteContent(JSON.parse(body)['posts']);
            });
        }).on('error', (err) => {
            console.log(err);
        });
    }

    function getMediaPagesNumber(callback) {
        const regPagesNum = /.*x-wp-totalpages":"(\d).*/g;

        http.get(Config.STAGING_URL + Config.MEDIA_PORTION_URL + '&page=1', (res) => {
            return callback(JSON.stringify(res.headers).replace(regPagesNum, '$1'));
        }).on('error', (err) => {
            console.log(err);
        });
    }

    const getMediaFromWP = (pagesNum, callback) => {
        for(let i = 1; i <= pagesNum; i++) {
            getMediaPortion(i, () => {
               if( i == pagesNum ) return callback();
            });
        }
    };

    function getMediaPortion(page, callback) {
        http.get(Config.STAGING_URL + Config.MEDIA_PORTION_URL + '&page=' + page, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                allImagesInfo = allImagesInfo.concat(JSON.parse(body));
                callback();
            });
        }).on('error', (err) => {
            console.log(err);
        });
    }

    return () => {
        getMediaPagesNumber((pagesNum) => {
            getMediaFromWP(pagesNum, () => {
                Images.setImagesFromWp(allImagesInfo);
                getPagesFromWP();
                allImagesInfo = [];
            });
        });
    }
};

const getAllDataFromWp = wpWorker();

exports.getAllDataFromWp = getAllDataFromWp;