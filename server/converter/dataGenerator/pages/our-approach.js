'use strict';
var exports = module.exports = {};

const ConfigJson = require('../../../config.json');
const Utils = require('../../utils/utils');
const Images = require('./../imageWorker');

const ourApproachWorker = ((pageData) => {
    const mainImage = createOurApproachImage(pageData.customFields['background'][0]);
    let ourApproachFile = createOurApproachFile(pageData.customFields, mainImage);
    ourApproachFile.short = createApproachData(pageData.customFields);
    Utils.writeJsonFile(ConfigJson.PATH_TO_JSON_DATA, 'our-approach.json', ourApproachFile, true);

    if (pageData.modified) {
        Images.loadImgById(pageData.customFields['background'][0], ConfigJson.PATH_APPROACH_IMAGES + mainImage, true);
    }
});

function createOurApproachImage(imageId) {
    return 'banner_approach.' + Images.getImageFormatById(imageId);
}

function createOurApproachFile(customFields, mainImage) {
    return {
        name: customFields['name'][0],
        title: customFields['title'][0],
        keywords: customFields['keywords'][0],
        description: customFields['description'][0],
        text: customFields['text'][0],
        background: 'our_approach/' + mainImage,
        alt: Images.getImageAltById(customFields['background'][0]),
        short: []
    }
}

function createApproachData(customFields) {
    const imagesIds = customFields['approach'][0];
    let arr = [];

    for (let i = 0; i < imagesIds; i++) {
        arr[i] = {};
    }

    const regex = /approach_(\d)_.*/;
    const regex_title = /approach_(\d)_title/;
    const regex_text = /approach_(\d)_text/;
    const regex_image = /approach_(\d)_image/;

    for (let key in customFields) {
        if (customFields.hasOwnProperty(key)) {
            if (regex.test(key)) {
                let index = key.replace(/approach_(\d)_.*/, "$1");
                if (regex_title.test(key)) {
                    arr[index].name = customFields[key][0];
                } else if (regex_text.test(key)) {
                    arr[index].text = customFields[key][0];
                } else if (regex_image.test(key)) {
                    let iconImage = 'icon_' + index + '.' + Images.getImageFormatById(customFields[key][0]);
                    Images.loadImgById(customFields[key][0], ConfigJson.PATH_APPROACH_IMAGES + iconImage, true);
                    arr[index].icon = "our_approach/" + iconImage;
                    arr[index].alt = Images.getImageAltById(customFields[key][0]);
                }
            }
        }
    }
    return arr;
}

exports.ourApproachWorker = ourApproachWorker;