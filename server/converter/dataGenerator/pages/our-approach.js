'use strict';
var exports = module.exports = {};

const Config = require('../../../config.js');
const Utils = require('../../utils/utils');
const Images = require('./../imageWorker');

const ourApproachWorker = (pageData) => {
    const mainImage = createOurApproachImage(pageData.customFields['background'][0]);
    let ourApproachFile = createOurApproachFile(pageData.customFields, mainImage);
    ourApproachFile.short = createApproachData(pageData.customFields);
    Utils.writeJsonFile(Config.PATH.JSON_DATA, 'our-approach.json', ourApproachFile, true);

    if (pageData.modified) {
        Images.loadImgById(pageData.customFields['background'][0], Config.PATH.APPROACH_IMAGES + mainImage, true);
    }
};

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

        const keyTitle = "approach_" + i + "_title";
        const keyText = "approach_" + i + "_text";
        const keyImage = "approach_" + i + "_image";

        if (customFields.hasOwnProperty(keyTitle)) {
            arr[i].title = customFields[keyTitle][0];
        }
        if (customFields.hasOwnProperty(keyText)) {
            arr[i].text = customFields[keyText][0];
        }
        if (customFields.hasOwnProperty(keyImage)) {
            const iconImage = 'icon_' + i + '.' + Images.getImageFormatById(customFields[keyImage][0]);
            Images.loadImgById(customFields[keyImage][0], Config.PATH.APPROACH_IMAGES + iconImage, true);
            arr[i].icon = "our_approach/" + iconImage;
            arr[i].alt = Images.getImageAltById(customFields[keyImage][0]);
        }
    }
    return arr;
}

exports.ourApproachWorker = ourApproachWorker;