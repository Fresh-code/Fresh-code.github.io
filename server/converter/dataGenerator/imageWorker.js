'use strict';
var exports = module.exports = {};

const request = require('request');
const fs = require('fs');
const Config = require('../../config');

let allImagesInfo = {};

function getImagePropertyById(id) {
    let imgInfo = allImagesInfo[id];
    return imgInfo ? imgInfo : null;
}

function getImageUrlById(id) {
    let imageInfo = getImagePropertyById(id);
    return imageInfo === null ? null : imageInfo['source_url'];
}

const setImagesFromWp = (images) => {
    images.forEach(function (image) {
        allImagesInfo[image['id']] = {
            alt_text: image['alt_text'],
            source_url: image['source_url'],
            name_in_wp: image['title']['rendered']
        }
    });
};

const getImageAltById = (id) => {
    let imageInfo = getImagePropertyById(id);
    return imageInfo === null ? null : imageInfo['alt_text'];
};

const getImageFormatById = (id) => {
    let imageInfo = getImagePropertyById(id);
    return imageInfo === null ? null : imageInfo['source_url'].split('.').pop();
};

const loadImgById = (imgId, imgPath, isTwoFolders) => {
    let url = getImageUrlById(imgId);
    if (url) {
        loadImage(url, imgPath, isTwoFolders === true);
    }
};

const loadImage = (url, imageName, isTwoFolders) => {
    if (typeof url != 'undefined' || url != null) {
        request(url).pipe(fs.createWriteStream(Config.PATH.ROOT + Config.PATH.WP_DATA_FOLDER + imageName)).on('error', function (err) {
            console.log("Loading image error: ", err);
        });
    } else {
        console.log("Can't load image. Url is undefined.", imageName);
    }
    /*if (isTwoFolders === true) {
        loadImage(url, Config.PATH.WP_DATA_FOLDER + imageName);
    }*/
};

const getAuthorImageNameById = (imageId) => {
    return getImagePropertyById(imageId)['name_in_wp'];
};


exports.setImagesFromWp = setImagesFromWp;
exports.getImageAltById = getImageAltById;
exports.getImageFormatById = getImageFormatById;
exports.getAuthorImageNameById = getAuthorImageNameById;
exports.loadImgById = loadImgById;
exports.loadImage = loadImage;