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
        getMediaPortion(1, pagesNum, () => {
            return callback();
        });
    };

    function getMediaPortion(page, pagesNum, callback) {
        http.get(Config.STAGING_URL + Config.MEDIA_PORTION_URL + '&page=' + page, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                allImagesInfo = allImagesInfo.concat(JSON.parse(body));

                if (page < pagesNum) {
                    getMediaPortion(++page, pagesNum, callback);
                } else {
                    callback();
                }
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