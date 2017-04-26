'use strict';
var exports = module.exports = {};

const Config = require('../../../config.js');
const Utils = require('../../utils/utils');
const Images = require('./../imageWorker');
const jsonfile = require('jsonfile');

const vacanciesWorker = (pageData) => {
    const  mainImage = createVacanciesImageName(pageData.customFields['page_background'][0]);
    let vacanciesFile = createVacanciesFile(pageData.customFields, mainImage);
    vacanciesFile.jobs = getApproachData(pageData.customFields);

    Utils.writeJsonFile(Config.PATH.JSON_DATA, 'job.json', vacanciesFile, true);

    if(pageData.modified) {
        Images.loadImgById(pageData.customFields['page_background'][0], Config.PATH.JOB_IMAGES + mainImage, true);
    }
};

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
        "page-background": '/' + Config.PATH.JOB_IMAGES + mainImage,
        "alt": Images.getImageAltById(customFields['page_background'][0]),
        "jobs": []
    }
}

function getApproachData(customFields) {

    function unicArray(arr) {
        let unicArr = arr.filter(function(item, pos) {
            return arr.indexOf(item) == pos;
        });
        return unicArr;
    }
    let arr = [];
    let iFrameVacancies = [];
    for (let i = 0; i < customFields['vacansies'][0]; i++) {
        const keyAvailable = "vacansies_" + i + "_is_available";

        if (customFields.hasOwnProperty(keyAvailable)) {
            if(customFields[keyAvailable][0] == "1") {

                arr[i] = {};
                const keyJiraName = "vacansies_" + i + "_jira_name";
                const keyTitle = "vacansies_" + i + "_title";
                const keySkills = "vacansies_" + i + "_skills";

                if (customFields.hasOwnProperty(keyTitle)) {
                    arr[i].title = customFields[keyTitle][0];
                }
                if (customFields.hasOwnProperty(keySkills)) {
                    arr[i].skills = customFields[keySkills][0].split('\r\n');
                }

                if (customFields.hasOwnProperty(keyJiraName)) {
                    iFrameVacancies.push(customFields[keyJiraName][0]);
                }
            }
        }
    }
    createIFrameData(customFields['token'][0], unicArray(iFrameVacancies));
    return arr;
}

function createIFrameData(token, vacancies){
    const data = {
        token: token,
        positions: vacancies.join()
    };
    jsonfile.writeFile(Config.PATH.WP_DATA_FOLDER +'iFramePositions.json', data, {spaces: 2}, function (err) {
        if (err) {
            console.error("ERROR WHILE WRITING JSON FILE: " + err);
        }
    });
}

exports.vacanciesWorker = vacanciesWorker;