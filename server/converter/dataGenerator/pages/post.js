'use strict';
var exports = module.exports = {};

const fs = require('fs');

const Config = require('../../../config.js');
const Utils = require('../../utils/utils');
const Images = require('./../imageWorker');
const State = require('../../stateController/stateController');


function addRedirect(slug) {
    switch (slug) {
        case "fixed-price-model":
            return '\nredirect_from: /blog/2016/10/05/fixed-price-model/' + '\n';
            break;
        case "software-testing":
            return '\nredirect_from: /blog/2017/01/22/software/testing/' + '\n';
            break;
        case "how-to-ruin-first-impression":
            return '\nredirect_from: /blog/2017/01/03/how/to/ruin/first/impression/' + '\n';
            break;
    }
    return '\n';
}

function fixColon(str) {
    return str.replace(/:/g, "&#58;");
}

function loadPostIncludedImages(content, slug) {
    const regexpImage = /<img.*src="(.*)".alt="/g;
    const regexpFormat = /.*(\.[a-zA-z]+)/g;
    let matches, output = [];

    while (matches = regexpImage.exec(content)) {
        output.push(matches[1]);
    }

    output.map((url, index) => {
        Images.loadImage(url, 'img/blog-post/' + slug + '/' + 'included_' + index + url.replace(regexpFormat, '$1'), true);
    });
}

function getPostCategory(tag) {
    const tags = {
        business: "Business",
        conferences: "Conferences",
        development: "Development",
        front: "Front End",
        management: "Management",
    };
    return tags[tag];
}

function createPostContent(slug, content) {
    const regexImage = /<img.*align([a-zA-z]+).*src="http(.*)\/(.*(\.[a-zA-z]+))".alt="(.*)".width.*>/;
    const imagesNumber = (content.split(regexImage).length - 1);

    for (let i = 0; i < imagesNumber; i++) {
        content = content.replace(regexImage, '<div style="text-align:' + '$1' + ';">' +
            '<img src="/img/blog-post/' + slug + '/included_' + i + '$4' + '" alt="' + '$5' + '" style="max-width:100%" />');
    }

    return '<div class="post-body p-t-6rem">' +
        content.replace(/<p>&nbsp;<\/p>/g, '<br>') + '\n' +
        '</div>';
}

function getImagesData(customFields, slug) {
    let postImagesInfo = {
        mainImage: {
            name: 'banner_post.' + Images.getImageFormatById(customFields['background'][0]),
            id: customFields['background'][0]
        },
        recentImage: {
            name: 'recent_post.' + Images.getImageFormatById(customFields['recent'][0]),
            id: customFields['recent'][0]
        },
        authorImage: {
            name: Images.getAuthorImageNameById(customFields['author_image'][0]) + '.' + Images.getImageFormatById(customFields['author_image'][0]),
            id: customFields['author_image'][0]
        },
        cover: 'post_c',
        coverImage: {
            name: 'post_c.jpg',
            id: customFields['cover'][0]
        },
        pathToPostImages: '/' + createImagesFolderPath(slug) + '/'
    };

    if(!isKeyUndefined(customFields['mobile_background'])) {
        postImagesInfo.mobileBackground = {
            name: 'mobile_banner_post.' + Images.getImageFormatById(customFields['mobile_background'][0]),
                id: customFields['mobile_background'][0]
        };
    }
    return postImagesInfo;
}

function createPostFile(customFields, pageDate, slug, content, imagesData) {
    let post = '--- \n' +
        'layout: post\n' +
        'title: ' + fixColon(customFields['title'][0]) + '\n' +
        'description: ' + fixColon(customFields['description'][0]) + '\n' +
        'date: ' + pageDate + ' \n' +
        'permalink: ' + createPostLink(pageDate, slug) + '\n' +
        'post-title: ' + fixColon(customFields['title_post'][0]) + '\n' +
        'categories-tag: ' + getPostCategory(customFields['tag_type'][0]) + '\n' +
        'background: ' + imagesData.pathToPostImages + imagesData.mainImage.name + '\n' +
        'recent-cover: ' + imagesData.pathToPostImages + imagesData.recentImage.name + '\n' +
        'background-color: "' + customFields['background_color'][0] + '"\n' +
        'type: ' + customFields['tag_type'][0] + '\n' +
        'cover: ' + imagesData.pathToPostImages + imagesData.cover + '-350.jpg \n' +
        'srcsetattr: ' + imagesData.pathToPostImages + imagesData.cover + '-700.jpg 700w, ' + imagesData.pathToPostImages +
            imagesData.cover + '-450.jpg 450w, ' + imagesData.pathToPostImages + imagesData.cover + '-350.jpg 350w \n' +
        'sizeattr: "(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px"' + '\n' +
        'background-cover: "' + customFields['background_color'][0] + '"\n' +
        'avatar: ' + '/img/blog-post/' + imagesData.authorImage.name + '\n' +
        'author: ' + fixColon(customFields['author'][0]) + '\n' +
        'position: ' + fixColon(customFields['position'][0]) + '\n' +
        'share-image: ' + imagesData.pathToPostImages + imagesData.mainImage.name + '\n' +
        'share-description: ' + fixColon(customFields['description'][0]) + '\n' +
        'share-title: ' + fixColon(customFields['title_post'][0]) + addRedirect(slug); //+

    if (!isKeyUndefined(customFields['mobile_background']) && customFields['mobile_background'][0] != '') {
        post += 'mobile_background: ' + imagesData.pathToPostImages + imagesData.mobileBackground.name + '\n';
    }

    post += '---' + '\n' +
        createPostContent(slug, content);

    return post;
}

function loadImages(imagesData, content, slug) {
    const folderPath = createImagesFolderPath(slug);
    Utils.createFoldersIfNotExist(folderPath);

    Images.loadImgById(imagesData.mainImage.id, folderPath + '/' + imagesData.mainImage.name, true);
    Images.loadImgById(imagesData.authorImage.id, Config.PATH.BLOG_IMAGES + imagesData.authorImage.name, true);
    Images.loadImgById(imagesData.recentImage.id, folderPath + '/' + imagesData.recentImage.name, true);
    Images.loadImgById(imagesData.coverImage.id, folderPath + '/' + imagesData.coverImage.name, true);

    if (!isKeyUndefined(imagesData.mobileBackground.id)) {
        Images.loadImgById(imagesData.mobileBackground.id, folderPath + '/' + imagesData.mobileBackground.name, true);
    }

    loadPostIncludedImages(content, slug);
}

function removeOldFileIfNameChanged(pageId, postName) {
    const oldFileName = State.getState(pageId)['fileName'];
    if (oldFileName != postName) {
        Utils.removeFileFromSite(Config.PATH.POSTS, oldFileName, true);
        State.updateStateFilename(pageId, postName);
    }
}

function createImagesFolderPath(slug) {
    return Config.PATH.BLOG_IMAGES + slug;
}

function createPostLink(date, slug) {
    return '/blog/' + (date.split(' ')[0]).replace(/-/g, "/") + '/' + slug + '/';
}

function isKeyUndefined(key) {
    return (typeof key === 'undefined');
}

const postWorker = (pageData) => {
    const imagesData = getImagesData(pageData.customFields, pageData.slug);
    const postName = Utils.createPostFileName(pageData.pageDate, pageData.slug);
    const file = createPostFile(pageData.customFields, pageData.pageDate, pageData.slug, pageData.content, imagesData);

    Utils.writeFile(Config.PATH.POSTS, Utils.createPostFileName(pageData.pageDate, pageData.slug), file, true);

    if (pageData.modified) {
        removeOldFileIfNameChanged(pageData.pageId, postName);
        loadImages(imagesData, pageData.content, pageData.slug);
    }
};

exports.postWorker = postWorker;