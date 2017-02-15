'use strict';
var exports = module.exports = {};

require('shelljs/global');
const path = require("path");
const fs = require('fs');

const ConfigJson = require('../dataModels/config.json');
const Images = require('./imageWorker');
const Utils = require('../utils/utils');
const State = require('../stateController/stateController');


function createHtmlTemplateIfNotExist(templateType, slug) {
    fs.exists('/src/wp-data/_pages/' + slug + '.html', function (exists) {
        if (exists != true) {
            let htmlTemplate = fs.readFileSync(ConfigJson.PATH_TO_TEMPLATES + templateType + '.html', {
                encoding: "UTF-8",
                flag: "r"
            });
            htmlTemplate = htmlTemplate.replace(/template/g, slug);
            Utils.writeFile(ConfigJson.PATH_TO_HTML_PROJECTS, slug + '.html', htmlTemplate, true);
        }
    });
}
function loadPostIncludedImages(id, content) {
    let regexp = /<img.*src="(.*)".alt="/g;
    let matches, output = [];
    while (matches = regexp.exec(content)) {
        output.push(matches[1]);
    }
    output.forEach(function (url) {
        Images.loadImage(url, 'img/blog-post/' + 'included_' + id + '_' + url.replace(/(.*)\/(.*)/g, '$2'), true);
    });
}
function loadProductImages(productId, folder, first, second, third, cover) {
    fs.exists('img/' + folder, function (exists) {
        if (exists != true) {
            mkdir('-p', 'img/' + folder);
        }
        Images.loadImgById(first, 'img/' + folder + '/work_first_img_' + productId + 'p');
        Images.loadImgById(second, 'img/' + folder + '/work_second_img_' + productId + 'p');
        Images.loadImgById(third, 'img/' + folder + '/work_third_img_' + productId + 'p');
    });
    fs.exists('wp-data/img/' + folder, function (exists) {
        if (exists != true) {
            mkdir('-p', 'wp-data/img/' + folder);
        }
        Images.loadImgById(first, 'wp-data/img/' + folder + '/work_first_img_' + productId + 'p');
        Images.loadImgById(second, 'wp-data/img/' + folder + '/work_second_img_' + productId + 'p');
        Images.loadImgById(third, 'wp-data/img/' + folder + '/work_third_img_' + productId + 'p');
    });
    Images.loadImgById(cover, 'img/portfolio/work_' + productId + 'p', true);
}
function loadPostImages(productId, background, author, cover, recent) {
    Images.loadImgById(background, 'img/blog-post/banner_post_' + productId, true);
    Images.loadImgById(author, 'img/blog-post/post_author_' + productId, true);
    Images.loadImgById(recent, 'img/blog-post/recent_post_' + productId, true);
    Images.loadImgById(cover, 'img/blog-post/post_' + productId + 'c', true);
}

let updatePageData = function (wpDoc, state, wpDocSlug, wpDocName) {
    switch (wpDoc.categories[0].slug) {
        case "product": {
            loadProductImages(wpDoc.id, wpDocSlug, wpDoc.custom_fields.first[0], wpDoc.custom_fields.second[0], wpDoc.custom_fields.third[0], wpDoc.custom_fields.cover[0]);
            if (state.fileName != wpDocName + '.json') {
                Utils.removeFile(ConfigJson.PATH_TO_JSON_PROJECTS, state.fileName, true);
                Utils.removeFile(ConfigJson.PATH_TO_HTML_PROJECTS, state.htmlFileName, true);
            }
            state.modified = wpDoc.modified;
            createHtmlTemplateIfNotExist(wpDoc.custom_fields.temlate_type[0], wpDocName);
        }
            break;
        case "post": {
            let postName = Utils.createPostName(wpDoc.date, wpDocName);

            if (state.fileName != postName) {
                Utils.removeFile(ConfigJson.PATH_TO_POSTS, state.fileName);
                state.fileName = postName;
            }
            state.modified = wpDoc.modified;
            loadPostImages(wpDoc.id, wpDoc.custom_fields.background[0], wpDoc.custom_fields.author_image[0], wpDoc.custom_fields.cover[0], wpDoc.custom_fields.recent[0]);
            loadPostIncludedImages(wpDoc.id, wpDoc.content);
        }
            break;
        case "testimonial": {
            Images.loadImgById(wpDoc.custom_fields.photo, 'img/testimonials/testimonial_author_' + wpDoc.id, true);
            state.modified = wpDoc.modified;
            state.fileName = wpDoc.fileName;
        }
            break;
    }

    switch (wpDoc.id) {
        //our-approach
        case 733: {
            state.modified = wpDoc.modified;
            Images.loadImgById(wpDoc.custom_fields.background[0], "img/our_approach/banner_approach", true);
        }
            break;
        case 78: {
            Images.loadImgById(wpDoc.custom_fields.photo[0], 'img/portfolio/banner_portfolio', true);
            state.modified = wpDoc.modified;
        }
            break;
        //testimonials-page
        case 121: {
            state.modified = wpDoc.modified;
            wpDoc.attachments.forEach(function (item) {
                if (item.title == 'icon') {
                    Images.loadImage(item.url, 'img/testimonials/' + Utils.getImageName(item.url), true);
                }
            });

            Images.loadImgById(wpDoc.custom_fields.photo[0], 'img/testimonials/banner_testimonials', true);
        }
            break;
        //vacancies-page
        case 763: {
            state.modified = wpDoc.modified;
            Images.loadImgById(wpDoc.custom_fields.page_background[0], "img/job/banner_job", true);
        }
            break;
        //blog-page
        case 73: {
            if (state.fileName != 'blog-page.json') {
                Utils.removeFile(ConfigJson.PATH_TO_JSON_DATA, 'blog-page.json', true);
                state.fileName = wpDoc.title + '.json';
            }
            state.modified = wpDoc.modified;
            Images.loadImgById(wpDoc.custom_fields.photo[0], 'img/blog/banner_blog', true);
        }
            break;
    }
    State.updateState(state);
};

exports.updatePageData = updatePageData;