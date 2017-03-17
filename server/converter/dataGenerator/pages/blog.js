'use strict';
var exports = module.exports = {};

const Config = require('../../../config.js');
const Utils = require('../../utils/utils');
const Images = require('./../imageWorker');

const blogWorker = (pageData) => {
    const mainImage = createBlogImageName(pageData.customFields['photo'][0]);
    const blogFile = createBlogFile(pageData.customFields, mainImage, pageData.slug);

    Utils.writeJsonFile(Config.PATH.JSON_DATA, 'blog.json', blogFile, true);

    if(pageData.modified) {
        Images.loadImgById(pageData.customFields['photo'][0], Config.PATH.BLOG + mainImage, true);
    }
};

function createBlogImageName(imageId) {
    return 'banner_blog.' + Images.getImageFormatById(imageId);
}

function createBlogFile(customFields, mainImage, slug) {
    return {
        name: slug,
        title: customFields['title'][0],
        keywords: customFields['title'][0],
        description: customFields['description'][0],
        page_title: customFields['page_title'][0],
        page_text: "<span class='inline-text'>" + customFields['page_text'][0] + "</span>",
        page_background: '/' + Config.PATH.BLOG + mainImage,
        alt: Images.getImageAltById(customFields['photo'][0])
    }
}

exports.blogWorker = blogWorker;