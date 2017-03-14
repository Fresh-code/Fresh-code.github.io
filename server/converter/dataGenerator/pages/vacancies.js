'use strict';
var exports = module.exports = {};

const ConfigJson = require('../../../config.json');
const Utils = require('../../utils/utils');
const Images = require('./../imageWorker');

const vacanciesWorker = ((pageData) => {
    const  mainImage = createVacanciesImageName(pageData.customFields['page_background'][0]);
    let vacanciesFile = createVacanciesFile(pageData.customFields, mainImage);
    vacanciesFile.jobs = getApproachData(pageData.customFields);

    Utils.writeJsonFile(ConfigJson.PATH_TO_JSON_DATA, 'job.json', vacanciesFile, true);

    if(pageData.modified) {
        Images.loadImgById(pageData.customFields['page_background'][0], ConfigJson.PATH_JOB_IMAGES + mainImage, true);
    }
});

function createVacanciesImageName(imageId) {
    return 'banner_job.' + Images.getImageFormatById(imageId);
}

function createVacanciesFile(customFields, mainImage) {
    return {
        "title": customFields['title'][0],
        "keywords": customFields['keywords'][0],
        "description": customFields['description'][0],
        "page-title": customFields['page_title'][0],
        "page-text": customFields['page_text'][0],
        "page-background": '/' + ConfigJson.PATH_JOB_IMAGES + mainImage,
        "alt": Images.getImageAltById(customFields['page_background'][0]),
        "jobs": []
    }
}

function getApproachData(customFields) {
    let arr = [];
    for (let i = 0; i < customFields['vacansies'][0]; i++) {
        arr[i] = {};
    }

    const regex = /vacansies_(\d)_.*/;
    const regex_title = /vacansies_(\d)_title/;
    const regex_skills = /vacansies_(\d)_skills/;

    for (let key in customFields) {
        if (customFields.hasOwnProperty(key)) {
            if (regex.test(key)) {
                const index = key.replace(regex, "$1");
                if (regex_title.test(key)) {
                    arr[index].title = customFields[key][0];
                } else if (regex_skills.test(key)) {
                    arr[index].skills = customFields[key][0].split('\r\n');
                }
            }
        }
    }
    return arr;
}

exports.vacanciesWorker = vacanciesWorker;