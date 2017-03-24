'use strict';
var exports = module.exports = {};

const fs = require('fs');

const Config = require('../../../config.js');
const Utils = require('../../utils/utils');
const Images = require('./../imageWorker');
const LinksMap = require('../projectLinksWorker');
const State = require('../../stateController/stateController');
const Portfolio = require('./portfolio');

const productWorker = ((pageData) => {
    const imagesData = getImagesData(pageData.customFields);
    const productName = Utils.createProductName(pageData.slug);
    const file = createProductFile(pageData.customFields, LinksMap.getProjectLinks(pageData.pageId),
        pageData.slug, imagesData);
    Utils.writeJsonFile(Config.PATH.JSON_PROJECTS, productName, file, true);
    Portfolio.addProductToPortfolio(pageData.customFields, imagesData.cover.name, pageData.slug);

    if (pageData.modified) {
        const productHtmlName = Utils.createProductHtmlName(pageData.slug);
        Utils.createFoldersIfNotExist(createImagesFolderName(pageData.slug));
        loadImages(imagesData, pageData.slug);
        removeOldFilesIfNameChanged(pageData.pageId, productName, productHtmlName);
        createHtmlTemplateIfNotExist(pageData.customFields['temlate_type'][0], pageData.slug, productHtmlName);
    }
});

function createHtmlTemplateIfNotExist(templateType, slug, productHtmlName) {

    function ConvertTemplateToProduct(htmlTemplate, slug) {
        return htmlTemplate.replace(/template/g, slug);
    }

    fs.exists(Config.PATH.ROOT + Config.PATH.WP_HTML_PROJECTS + productHtmlName, function (exists) {
        if (exists != true) {
            let htmlTemplate = fs.readFileSync(Config.PATH.ROOT + Config.PATH.TEMPLATES + Utils.createProductHtmlName(templateType), {
                encoding: "UTF-8",
                flag: "r"
            });
            htmlTemplate = ConvertTemplateToProduct(htmlTemplate, slug);
            Utils.writeFile(Config.PATH.HTML_PROJECTS, productHtmlName, htmlTemplate, true);
        }
    });
}

function getImagesData(customFields) {
    return {
        firstImage: {
            name: 'work_first_p.' + Images.getImageFormatById(customFields['first'][0]),
            id: customFields['first'][0]
        },
        secondImage: {
            name: 'work_second_p.' + Images.getImageFormatById(customFields['second'][0]),
            id: customFields['second'][0]
        },
        thirdImage: {
            name: 'work_third_p.' + Images.getImageFormatById(customFields['third'][0]),
            id: customFields['third'][0]
        },
        cover: {name: 'work_portfolio_cover_p'},
        coverImage: {name: 'work_portfolio_cover_p.jpg', id: customFields['cover'][0]},
    }
}

function createProductFile(customFields, links, slug, imagesData) {
    return {
        name: slug,
        client: customFields['client'][0],
        title: customFields['title'][0],
        description: customFields['description'][0],
        site: customFields['site'][0],
        link: customFields['link'][0],
        industry: customFields['industry'][0],
        country: customFields['country'][0],
        teamSize: customFields['teamsize'][0],
        techUsed: customFields['techused'][0],
        projDuration: customFields['projduration'][0],
        pdf: customFields['pdf'][0],
        workStages: customFields['workstages'][0],
        body_color: customFields['body_color'][0],
        images: [
            {
                alt: Images.getImageAltById(customFields['first'][0]),
                img: createImgPath(slug, imagesData.firstImage.name)
            },
            {
                alt: Images.getImageAltById(customFields['second'][0]),
                img: createImgPath(slug, imagesData.secondImage.name)
            },
            {
                alt: Images.getImageAltById(customFields['third'][0]),
                img: createImgPath(slug, imagesData.thirdImage.name)
            }
        ],
        challenges: customFields['challenges'][0],
        buisValue: customFields['buisvalue'][0],
        solutions: customFields['solutions'][0],
        prev: links.prev,
        next: links.next
    }
}

function createImagesFolderName(slug) {
    return 'img/' + slug;
}

function createImgPath(slug, imageName) {
    return "/img/" + slug + "/" + imageName;
}

function removeOldFilesIfNameChanged(pageId, productName, htmlProductName) {
    const oldFileName = State.getState(pageId)['fileName'];
    const oldHtmlFileName = State.getState(pageId)['htmlFileName'];

    if (oldFileName != productName) {
        Utils.removeFileFromSite(Config.PATH.JSON_PROJECTS, oldFileName, true);
        State.updateStateFilename(pageId, productName);
    }
    if (oldHtmlFileName != htmlProductName) {
        Utils.removeFileFromSite(Config.PATH.HTML_PROJECTS, oldHtmlFileName, true);
        State.updateStateHtmlFilename(pageId, htmlProductName);
    }
}

function loadImages(imagesData, slug) {
    const folder = createImagesFolderName(slug);
    Utils.createFoldersIfNotExist(folder);

    Images.loadImgById(imagesData.firstImage.id, folder + '/' + imagesData.firstImage.name, true);
    Images.loadImgById(imagesData.secondImage.id, folder + '/' + imagesData.secondImage.name, true);
    Images.loadImgById(imagesData.thirdImage.id, folder + '/' + imagesData.thirdImage.name, true);
    Images.loadImgById(imagesData.coverImage.id, folder + '/' + imagesData.coverImage.name, true);
}

exports.productWorker = productWorker;