'use strict';
var exports = module.exports = {};

const ConfigJson = require('../../../config.json');
const Images = require('./../imageWorker');
const Utils = require('../../utils/utils');

let portfolioData = {};
let portfolioWorks = [];

const addProductToPortfolio = ((customFields, cover, slug) => {
    portfolioWorks.push({
        title: customFields['preview_title'][0],
        description: customFields['preview_description'][0],
        cover: '/img/' + slug + '/' + cover + "-350.jpg",
        alt: Images.getImageAltById(customFields['cover'][0]),
        srcsetattr: '/img/' + slug + '/' + cover + "-700.jpg 700w, /img/" + slug + '/'
        + cover + "-450.jpg 450w, /img/" + slug + '/' + cover + "-350.jpg 350w",
        sizesattr: "(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px",
        link: '/' + slug,
        type: customFields['preview_type'][0],
        mainColor: customFields['preview_maincolor'][0]
    });
});

function clearData() {
    portfolioData = {};
    portfolioWorks = [];
}
const portfolioWorker = ((pageData) => {
    const mainImage = createPortfolioImageName(pageData.customFields['photo'][0]);
    createPortfolioFile(pageData.customFields, mainImage);

    if (pageData.modified) {
        Images.loadImgById(pageData.customFields['photo'][0], ConfigJson.PATH_PORTFOLIO_IMAGES + mainImage, true);
    }
});

function createPortfolioImageName(imageId) {
    return 'banner_portfolio.' + Images.getImageFormatById(imageId);
}

function createPortfolioFile(customFields, mainImage) {
    portfolioData = {
        title: customFields['title'][0],
        keywords: customFields['keywords'][0],
        description: customFields['description'][0],
        page_title: customFields['page_title'][0],
        page_text: "<span class='inline-text'>" + customFields['page_text'][0] + "</span>",
        page_textbot: "<span class='inline-text'>" + customFields['page_textbot'][0] + "</span>",
        page_background: '/' + ConfigJson.PATH_PORTFOLIO_IMAGES + mainImage,
        alt: Images.getImageAltById(customFields['photo'][0]),
        works: []
    };
}

const writePortfolioFile = (() => {
    portfolioData.works = portfolioWorks;
    Utils.writeJsonFile(ConfigJson.PATH_TO_JSON_DATA, 'portfolio.json', portfolioData, true);
    clearData();
});

exports.portfolioWorker = portfolioWorker;
exports.addProductToPortfolio = addProductToPortfolio;
exports.writePortfolioFile = writePortfolioFile;