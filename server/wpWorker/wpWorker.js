'use strict';
var exports = module.exports = {};

const http = require('http');

const Converter = require('../converter/converter');
const Images = require('../converter/dataGenerator/imageWorker');
const ConfigJson = require('../config.json');


let page = 1;
let mediaPagesNumber;
let allImagesInfo = [];

function getMediaPagesNumber() {
    http.get(ConfigJson.URL_FOR_IMAGES + '&page=1', function (res) {
        mediaPagesNumber = JSON.stringify(res.headers).replace(/.*x-wp-totalpages":"(\d).*/g, '$1');
    }).on('error', function (err) {
        console.log(err);
    });
}

function getPagesFromWP() {
    http.get(ConfigJson.URL_FOR_PAGES, function (res) {
        let body = "";
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            Converter.creatingSiteContent(JSON.parse(body));
        });
    }).on('error', function (err) {
        console.log(err);
    });
}

const getMediaFromWP = function () {
    http.get(ConfigJson.URL_FOR_IMAGES + '&page=' + page, function (res) {
        if (page === 1) {
            getMediaPagesNumber();
        }
        let body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            allImagesInfo = allImagesInfo.concat(JSON.parse(body));
            if (page < mediaPagesNumber) {
                getMediaFromWP(++page);
            } else {
                Images.setImagesFromWp(allImagesInfo);
                getPagesFromWP();
                page = 1;
            }
        });
    }).on('error', function (err) {
        console.log(err);
    });
};

exports.getMediaFromWP = getMediaFromWP;