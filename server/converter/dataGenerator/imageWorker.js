'use strict';
var exports = module.exports = {};

const request = require('request');
const fs = require('fs');

let allImagesInfo = {};

function getImagePropertyById(id) {
    let imgInfo = allImagesInfo[id];
    return imgInfo ? imgInfo : null;
}

function getImageUrlById(id) {
    let imageInfo = getImagePropertyById(id);
    return imageInfo === null ? null : imageInfo['source_url'];
}

let setImagesFromWp = function (images) {
    images.forEach(function (image) {
        allImagesInfo[image['id']] = {alt_text: image['alt_text'], source_url: image['source_url']}
    });
};

let getImageAltById = function (id) {
    let imageInfo = getImagePropertyById(id);
    return imageInfo === null ? null : imageInfo['alt_text'];
};

let getImageFormatById = function (id) {
    let imageInfo = getImagePropertyById(id);
    return imageInfo === null ? null : imageInfo['source_url'].split('.').pop();
};

let loadImgById = function (imgId, imgPath, isTwoFolders) {
    let url = getImageUrlById(imgId);
    if (url) {
        loadImage(url, imgPath, isTwoFolders === true);
    }
};

let loadImage = function (url, imageName, isTwoFolders) {
    if (typeof url != 'undefined' || url != null) {
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