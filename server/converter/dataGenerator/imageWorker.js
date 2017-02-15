'use strict';
var exports = module.exports = {};

const request = require('request');
const fs = require('fs');

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

let setImagesFromWp = function (images) {
    allImagesInfo = images;
};

let getImageAltById = function (id) {
    return getImagePropertyById(id).alt_text;
};

let getImageFormatById = function (id) {
    return getImagePropertyById(id).source_url.split('.').pop();
};

let loadImgById = function (imgId, imgPath, isTwoFolders) {
    loadImage(getImageUrlById(imgId), imgPath + '.' + getImageFormatById(imgId), isTwoFolders === true);
};

let loadImage = function (url, imageName, isTwoFolders) {
    if (typeof url != 'undefined') {
        request(url).pipe(fs.createWriteStream('/src/' + imageName)).on('error', function (err) {
            console.log("Loading image error: ", err);
        });
    } else {
        console.log("Can't load image. Url is undefined.", imageName);
    }
    if (isTwoFolders === true) {
        loadImage(url, 'wp-data/' + imageName);
    }
};


exports.setImagesFromWp = setImagesFromWp;
exports.getImageAltById = getImageAltById;
exports.getImageFormatById = getImageFormatById;
exports.loadImgById = loadImgById;
exports.loadImage = loadImage;