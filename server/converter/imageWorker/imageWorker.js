'use strict';
var exports = module.exports = {};

const http = require('http');
const request = require('request');
const fs = require('fs');

const Converter = require('../converter');
const ConfigJson = require('../dataModels/config.json');


let mediaPagesNumber;
let allImagesInfo = [];

function getImagePropertyById(id) {
    for (let x in allImagesInfo) {
        if (allImagesInfo[x].id == id) {
            return allImagesInfo[x];
        }
    }
}
function getImageUrlById(id) {
    return getImagePropertyById(id).source_url;
}

let getMediaFromWP = function (page) {
    //Получать картники можно порциями максимум по 100 штук, поэтому, возможно, нужно записывать информацию о них в несколько подходов
    http.get(ConfigJson.URL_FOR_IMAGES + '&page=' + page, function (res) {
        if (page === 1) {
            //получаем количество страниц с картинками
            mediaPagesNumber = JSON.stringify(res.headers).replace(/.*x-wp-totalpages":"(\d).*/g, '$1');
        }
        let body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            if (mediaPagesNumber > 1) {
                allImagesInfo = allImagesInfo.concat(JSON.parse(body));
                if (page < mediaPagesNumber) {
                    getMediaFromWP(++page);
                } else if (page == mediaPagesNumber) {
                    Converter.getPagesFromWP();
                }
            } else {
                allImagesInfo = JSON.parse(body);
                Converter.getPagesFromWP();
            }
        });
    }).on('error', function (err) {
        console.log(err);
    });
};
let getImageAltById = function (id) {
    return getImagePropertyById(id).alt_text;
};
let getImageFormatById = function (id) {
    return getImagePropertyById(id).source_url.split('.').pop();
};
let loadImage = function (url, imageName, isTwoFolders) {
    if (typeof url != 'undefined') {
        request(url).pipe(fs.createWriteStream(__dirname + '/../../../' + imageName)).on('error', function (err) {
            console.log("Loading image error: ", err);
        });
    } else {
        console.log("Can't load image. Url is undefined.", imageName);
    }
    if (isTwoFolders === true) {
        loadImage(url, 'wp-data/' + imageName);
    }
};
let loadImgById = function (imgId, imgPath, isTwoFolders) {
    let imageURL = getImageUrlById(imgId);
        loadImage(imageURL, imgPath + '.' + getImageFormatById(imgId), isTwoFolders === true);
};


exports.getMediaFromWP = getMediaFromWP;
exports.getImageAltById = getImageAltById;
exports.getImageFormatById = getImageFormatById;
exports.loadImgById = loadImgById;
exports.loadImage = loadImage;
