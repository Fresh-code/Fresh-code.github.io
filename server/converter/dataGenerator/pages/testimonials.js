'use strict';
var exports = module.exports = {};

const ConfigJson = require('../../../config.json');
const Images = require('./../imageWorker');
const Utils = require('../../utils/utils');
const LinksMap = require('../projectLinksWorker');

let testimonialsFile = {};
let testimonialsArray = [];

function getProductLink(pointer) {
    const link = pointer.match(/:"(\d*)"/);
    return LinksMap.getProjectLinkById(link[1]);
}

function createAuthorImageName(imageId, slug) {
    return 'author_' + slug + '.' + Images.getImageFormatById(imageId);
}

function createProductImageLink(imageName){
    return '/' + ConfigJson.PATH_TESTIMONIALS_IMAGES + imageName;
}

function createTestimonial(customFields, authorImage) {
    testimonialsArray.push({
        author: customFields['author'][0],
        company: customFields['company'][0],
        text: customFields['text'][0],
        photo: createProductImageLink(authorImage),
        link: getProductLink(customFields['link'][0])
    });
}

const testimonialWorker = ((pageData) => {
    const authorImageName = createAuthorImageName(pageData.customFields['photo'][0], pageData.slug);
    createTestimonial(pageData.customFields, authorImageName);
    if (pageData.modified) {
        Images.loadImgById(pageData.customFields['photo'], ConfigJson.PATH_TESTIMONIALS_IMAGES + authorImageName, true);
    }
});

const saveTestimonialsFile = (() => {
    testimonialsFile.short = testimonialsArray;
    Utils.writeJsonFile(ConfigJson.PATH_TO_JSON_DATA, 'testimonials.json', testimonialsFile, true);
});

function createTestimonialsPage(customFields, mainImage) {
    testimonialsFile.title = customFields['title'][0];
    testimonialsFile.keywords = customFields['keywords'][0];
    testimonialsFile.description = customFields['description'][0];
    testimonialsFile.page_title = customFields['page_title'][0];
    testimonialsFile.page_text = "<span class='inline-text'>" + customFields['page_text'][0] + "</span>";
    testimonialsFile.page_background = '/' + ConfigJson.PATH_TESTIMONIALS_IMAGES + mainImage;
    testimonialsFile.alt = Images.getImageAltById(customFields['photo'][0]);
    testimonialsFile.icons = getAngSaveMainIcons(customFields['proj_images'][0]);
    testimonialsFile.short = [];
}

const testimonialsPageWorker = ((pageData) => {
    const mainImage = createTestimonialsMainImageName(pageData.customFields['photo'][0]);
    createTestimonialsPage(pageData.customFields, mainImage);

    if (pageData.modified) {
        Images.loadImgById(pageData.customFields['photo'][0], ConfigJson.PATH_TESTIMONIALS_IMAGES + mainImage, true);
    }
});

function createTestimonialsMainImageName(imageId){
    return 'banner_testimonials.' + Images.getImageFormatById(imageId);
}

function getAngSaveMainIcons(iconsIdArray) {
    if (iconsIdArray != undefined) {
        const projectIcons = iconsIdArray.split(",");
        let iconsJson = [];

        projectIcons.map((iconId, index) => {
            const iconName = ConfigJson.PATH_TESTIMONIALS_IMAGES + 'icon_' + index + '.' + Images.getImageFormatById(iconId);
            iconsJson.push(
                {
                    img: '/' + iconName,
                    alt: Images.getImageAltById(iconId)
                });
            Images.loadImgById(iconId, iconName, true);
        });
        return iconsJson;
    }
}

exports.testimonialWorker = testimonialWorker;
exports.testimonialsPageWorker = testimonialsPageWorker;
exports.saveTestimonialsFile = saveTestimonialsFile;