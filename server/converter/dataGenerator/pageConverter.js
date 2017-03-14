/*
'use strict';
var exports = module.exports = {};

const path = require("path");
const fs = require('fs');

const ConfigJson = require('../../config.json');
const Templates = require('../dataModels/templates.json');
const Utils = require('../utils/utils');
const Images = require('./imageWorker');
const LinksMap = require('./projectLinksWorker');
const State = require('../stateController/stateController');

let portfolioJson = Templates.PORTFOLIO_PAGE;
let testimonialsJson = Templates.TESTIMONIAL_PAGE;

let getAuthorImageName = function () {
    let photos = [];
    return function (id) {
        for (let i = 0; i < photos.length; i++) {
            if (photos[i] === id) {
                return 'author_' + i;
            }
        }
        photos.push(id);
        return 'author_' + (photos.length - 1);
    }
}();




let saveAllFiles = function () {
    Utils.writeJsonFile(ConfigJson.PATH_TO_JSON_DATA, 'portfolio.json', portfolioJson, true);
    Utils.writeJsonFile(ConfigJson.PATH_TO_JSON_DATA, 'testimonials.json', testimonialsJson, true);

    portfolioJson.works = [];
    testimonialsJson.short = [];
    testimonialsJson.icons = [];
};

let formPage = function (wpDoc, isModified) {
    let wpDocSlug = Utils.getClearName(wpDoc['slug']);
    let wpDocName = Utils.getClearName(wpDoc['title']);

    let customFields = wpDoc['custom_fields'];
    let pageId = wpDoc['id'];
    let pageDate = wpDoc['date'];
    let state = State.getState(pageId);


    function setStateFilename(fileName) {
        state['modified'] = fileName;
    }


    function onModified() {
        state['modified'] = wpDoc['modified'];
    }

    /!*function createProduct() {

        /!*function createHtmlTemplateIfNotExist(templateType, slug) {
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

        let firstImage = 'work_first_p.' + Images.getImageFormatById(customFields['first'][0]);
        let secondImage = 'work_second_p.' + Images.getImageFormatById(customFields['second'][0]);
        let thirdImage = 'work_third_p.' + Images.getImageFormatById(customFields['third'][0]);*!/
        let cover = 'work_portfolio_cover_p';
        //let coverImage = cover + '.jpg';

        /!*let product = Templates.PRODUCT;
        let links = LinksMap.getProjectLinks(pageId);

        product.name = wpDocName;
        product.client = customFields['client'][0];
        product.title = customFields['title[0]'];
        product.description = customFields['description'][0];
        product.site = customFields['site'][0];
        product.link = customFields['link'][0];
        product.industry = customFields['industry'][0];
        product.country = customFields['country'][0];
        product.teamSize = customFields['teamsize'][0];
        product.techUsed = customFields['techused'][0];
        product.projDuration = customFields['projduration'][0];
        product.pdf = customFields['pdf'][0];
        product.workStages = customFields['workstages'][0];
        product.body_color = customFields['body_color'][0];
        product.images[0].alt = Images.getImageAltById(customFields['first'][0]);
        product.images[0].img = "/img/" + wpDocSlug + "/" + firstImage;
        product.images[1].alt = Images.getImageAltById(customFields['second'][0]);
        product.images[1].img = "/img/" + wpDocSlug + "/" + secondImage;
        product.images[2].alt = Images.getImageAltById(customFields['third'][0]);
        product.images[2].img = "/img/" + wpDocSlug + "/" + thirdImage;
        product.challenges = customFields['challenges'][0];
        product.buisValue = customFields['buisvalue'][0];
        product.solutions = customFields['solutions'][0];
        product.prev = links.prev;
        product.next = links.next;*!/

        //Utils.writeJsonFile(ConfigJson.PATH_TO_JSON_PROJECTS, product.name + '.json', product, true);

        portfolioJson.works[portfolioJson.works.length] = {
            "title": customFields['preview_title'][0],
            "description": customFields['preview_description'][0],
            "cover": '/img/' + wpDocSlug + '/' + cover + "-350.jpg",
            "alt": Images.getImageAltById(customFields['cover'][0]),
            "srcsetattr": '/img/' + wpDocSlug + '/' + cover + "-700.jpg 700w, /img/" + wpDocSlug + '/' + cover + "-450.jpg 450w, /img/" + wpDocSlug + '/' + cover + "-350.jpg 350w",
            "sizesattr": "(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px",
            "link": '/' + wpDocName,
            "type": customFields['preview_type'][0],
            "mainColor": customFields['preview_maincolor'][0]
        };

       /!* if (isModified === true) {
            console.log('MODIFIED TRUE' + wpDocName);
            let dir = 'img/' + wpDocSlug;

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            if (!fs.existsSync('wp-data/' + dir)) {
                fs.mkdirSync('wp-data/' + dir);
            }


            Images.loadImgById(customFields['first'][0], dir + '/' + firstImage, true);
            Images.loadImgById(customFields['second'][0], dir + '/' + secondImage, true);
            Images.loadImgById(customFields['third'][0], dir + '/' + thirdImage, true);
            Images.loadImgById(customFields['cover'][0], dir + '/' + coverImage, true);

            if (state['fileName'] != wpDocName + '.json') {
                Utils.removeFile(ConfigJson.PATH_TO_JSON_PROJECTS, state['fileName'], true);
                Utils.removeFile(ConfigJson.PATH_TO_HTML_PROJECTS, state['htmlFileName'], true);
            }
            createHtmlTemplateIfNotExist(customFields['temlate_type'][0], wpDocName);
            onModified();
        }*!/
    }*!/

    /!*function createPost() {

        function getCategory(tag) {
            switch (tag) {
                case 'business': {
                    return 'Business';
                }
                    break;
                case 'conferences': {
                    return 'Conferences';
                }
                    break;
                case 'development': {
                    return 'Development';
                }
                    break;
                case 'front': {
                    return 'Front End';
                }
                    break;
                case 'management': {
                    return 'Management';
                }
                    break;
            }
        }
        function createPostContent(slug, content) {
            let regex = /<img.*align([a-zA-z]+).*src="http(.*)\/(.*(\.[a-zA-z]+))".alt="(.*)".width.*>/;
            let imagesNumber = (content.split(regex).length - 1);
            for (let i = 0; i < imagesNumber; i++) {
                content = content.replace(regex, '<div style="text-align:' + '$1' + ';">' +
                    '<img src="/img/blog-post/' + slug + '/included_' + i + '$4' + '" alt="' + '$5' + '" style="max-width:100%" />');
            }
            return '<div class="post-body p-t-6rem">' +
                content.replace(/<p>&nbsp;<\/p>/g, '<br>') + '\n' +
                '</div>';
        }

        function addRedirect(slug) {
            switch(slug) {
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
            let regexp = /<img.*src="(.*)".alt="/g;
            let matches, output = [];
            while (matches = regexp.exec(content)) {
                output.push(matches[1]);
            }
            output.forEach(function (url, index) {
                Images.loadImage(url, 'img/blog-post/' + slug + '/' + 'included_' + index + url.replace(/.*(\.[a-zA-z]+)/g, '$1'), true);
            });
        }

        let postName = Utils.createPostName(pageDate, wpDocSlug);
        let mainImage = 'banner_post.' + Images.getImageFormatById(customFields['background'][0]);
        let recentImage = 'recent_post.' + Images.getImageFormatById(customFields['recent'][0]);
        let authorImage = getAuthorImageName(customFields['author_image'][0]) + '.' + Images.getImageFormatById(customFields['author_image'][0]);
        let cover = 'post_c';
        let coverImage = cover + '.jpg';
        let pathToPostImages = '/img/blog-post/' + wpDocSlug + '/';

        let json_blog_data =
            '--- \n' +
            'layout: post\n' +
            'title: ' + fixColon(customFields['title'][0]) + '\n' +
            'description: ' + fixColon(customFields['description'][0]) + '\n' +
            'date: ' + pageDate + ' \n' +
            'permalink: ' + Utils.createPostLink(pageDate, wpDocSlug) + '\n' +
            'post-title: ' + fixColon(customFields['title_post'][0]) + '\n' +
            'categories-tag: ' + getCategory(customFields['tag_type'][0]) + '\n' +
            'background: ' + pathToPostImages + mainImage + '\n' +
            'recent-cover: ' + pathToPostImages + recentImage + '\n' +
            'background-color: "' + customFields['background_color'][0] + '"\n' +
            'type: ' + customFields['tag_type'][0] + '\n' +
            'cover: ' + pathToPostImages + cover + '-350.jpg \n' +
            'srcsetattr: ' + pathToPostImages + cover + '-700.jpg 700w, ' + pathToPostImages + cover + '-450.jpg 450w, ' + pathToPostImages + cover + '-350.jpg 350w \n' +
            'sizeattr: "(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px"' + '\n' +
            'background-cover: "' + customFields['background_color'][0] + '"\n' +
            'avatar: ' + '/img/blog-post/' + authorImage + '\n' +
            'author: ' + fixColon(customFields['author'][0]) + '\n' +
            'position: ' + fixColon(customFields['position'][0]) + '\n' +
            'share-image: ' + pathToPostImages + mainImage + '\n' +
            'share-description: ' + fixColon(customFields['description'][0]) + '\n' +
            'share-title: ' + fixColon(customFields['title_post'][0]) + addRedirect(wpDocSlug) +
            '---' + '\n' +
            createPostContent(wpDocSlug, wpDoc['content']);

        Utils.writeFile(ConfigJson.PATH_TO_POSTS, postName, json_blog_data, true);

        if (isModified === true) {

            if (state['fileName'] != postName) {
                Utils.removeFile(ConfigJson.PATH_TO_POSTS, state['fileName'], true);
                setStateFilename(postName);
            }

            console.log('MODIFIED ' + wpDocName);
            let dir = 'img/blog-post/' + wpDocSlug;

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            if (!fs.existsSync('wp-data/' + dir)) {
                fs.mkdirSync('wp-data/' + dir);
            }

            Images.loadImgById(customFields['background'][0], dir + '/' + mainImage, true);
            Images.loadImgById(customFields['author_image'][0], 'img/blog-post/' + authorImage, true);
            Images.loadImgById(customFields['recent'][0], dir + '/' + recentImage, true);
            Images.loadImgById(customFields['cover'][0], dir + '/' + coverImage, true);

            loadPostIncludedImages(wpDoc['content'], wpDocSlug);
            onModified();
        }
    }*!/

   /!* function createTestimonial() {
        let link = customFields['link'][0].match(/:"(\d*)"/);
        let mainImage = 'author_' + wpDocSlug + '.' + Images.getImageFormatById(customFields['photo']);

        testimonialsJson.short[testimonialsJson.short.length] = {
            "author": customFields['author'][0],
            "company": customFields['company'][0],
            "text": customFields['text'][0],
            "photo": '/' + ConfigJson.PATH_TESTIMONIALS_IMAGES + mainImage,
            "link": LinksMap.getProjectLinkById(link[1])
        };

        if (isModified === true) {
            Images.loadImgById(customFields['photo'], ConfigJson.PATH_TESTIMONIALS_IMAGES + mainImage, true);
            setStateFilename(wpDoc['fileName']);
            onModified();
        }
    }*!/

   /!* function createOurApproach() {
        let mainImage = 'banner_approach.' + Images.getImageFormatById(customFields['background'][0]);

        let ourApproach = {
            "name": customFields['name'][0],
            "title": customFields['title'][0],
            "keywords": customFields['keywords'][0],
            "description": customFields['description'][0],
            "text": customFields['text'][0],
            "background": 'our_approach/' + mainImage,
            "alt": Images.getImageAltById(customFields['background'][0]),
            "short": []
        };

        let arr = [];
        for (let i = 0; i < customFields['approach'][0]; i++) {
            arr[i] = {};
        }
        let regex = /approach_(\d)_.*!/;
        let regex_title = /approach_(\d)_title/;
        let regex_text = /approach_(\d)_text/;
        let regex_image = /approach_(\d)_image/;
        for (let key in customFields) {
            if (customFields.hasOwnProperty(key)) {
                if (regex.test(key)) {
                    let index = key.replace(/approach_(\d)_.*!/, "$1");
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
        ourApproach.short = arr;
        Utils.writeJsonFile(ConfigJson.PATH_TO_JSON_DATA, 'our-approach.json', ourApproach, true);

        if (isModified === true) {
            Images.loadImgById(customFields['background'][0], ConfigJson.PATH_APPROACH_IMAGES + mainImage, true);
            onModified();
        }
    }*!/

    /!*function createPortfolio() {
        let mainImage = 'banner_portfolio.' + Images.getImageFormatById(customFields['photo'][0]);

        portfolioJson.title = customFields['title'][0];
        portfolioJson.keywords = customFields['keywords'][0];
        portfolioJson.description = customFields['description'][0];
        portfolioJson.page_title = customFields['page_title'][0];
        portfolioJson.page_text = "<span class='inline-text'>" + customFields['page_text'][0] + "</span>";
        portfolioJson.page_textbot = "<span class='inline-text'>" + customFields['page_textbot'][0] + "</span>";
        portfolioJson.page_background = '/' + ConfigJson.PATH_PORTFOLIO_IMAGES + mainImage;
        portfolioJson.alt = Images.getImageAltById(customFields['photo'][0]);

        if (isModified === true) {
            Images.loadImgById(customFields['photo'][0], ConfigJson.PATH_PORTFOLIO_IMAGES + mainImage, true);
            onModified();
        }
    }*!/

    /!*function createTestimonials() {
        let mainImage = 'banner_testimonials.' + Images.getImageFormatById(customFields['photo'][0]);

        if (customFields['proj_images'][0] != undefined) {
            let projectIcons = customFields['proj_images'][0].split(",");
            projectIcons.forEach(function (iconId, index) {
                let icon = ConfigJson.PATH_TESTIMONIALS_IMAGES + 'icon_' + index + '.' + Images.getImageFormatById(iconId);
                testimonialsJson.icons[testimonialsJson.icons.length] =
                    {
                        "img": '/' + icon,
                        "alt": Images.getImageAltById(iconId)
                    };
                Images.loadImgById(iconId, icon, true);
            });
        }

        testimonialsJson.title = customFields['title'][0];
        testimonialsJson.keywords = customFields['keywords'][0];
        testimonialsJson.description = customFields['description'][0];
        testimonialsJson.page_title = customFields['page_title'][0];
        testimonialsJson.page_text = "<span class='inline-text'>" + customFields['page_text'][0] + "</span>";
        testimonialsJson.page_background = '/' + ConfigJson.PATH_TESTIMONIALS_IMAGES + mainImage;
        testimonialsJson.alt = Images.getImageAltById(customFields['photo'][0]);

        if (isModified === true) {
            Images.loadImgById(customFields['photo'][0], ConfigJson.PATH_TESTIMONIALS_IMAGES + mainImage, true);
            onModified();
        }
    }*!/

    function createVacancies() {
        let mainImage = 'banner_job.' + Images.getImageFormatById(customFields['page_background'][0]);

        let vacancies = {
            "title": customFields['title'][0],
            "keywords": customFields['keywords'][0],
            "description": customFields['description'][0],
            "page-title": customFields['page_title'][0],
            "page-text": customFields['page_text'][0],
            "page-background": '/' + ConfigJson.PATH_JOB_IMAGES + mainImage,
            "alt": Images.getImageAltById(customFields['page_background'][0]),
            "jobs": []
        };

        let arr = [];
        for (let i = 0; i < customFields['vacansies'][0]; i++) {
            arr[i] = {};
        }
        let regex = /vacansies_(\d)_.*!/;
        let regex_title = /vacansies_(\d)_title/;
        let regex_skills = /vacansies_(\d)_skills/;
        for (let key in customFields) {
            if (customFields.hasOwnProperty(key)) {
                if (regex.test(key)) {
                    let index = key.replace(/vacansies_(\d)_.*!/, "$1");
                    if (regex_title.test(key)) {
                        arr[index].title = customFields[key][0];
                    } else if (regex_skills.test(key)) {
                        arr[index].skills = customFields[key][0].split('\r\n');
                    }
                }
            }
        }
        vacancies.jobs = arr;
        Utils.writeJsonFile(ConfigJson.PATH_TO_JSON_DATA, 'job.json', vacancies, true);

        if (isModified === true) {
            Images.loadImgById(customFields['page_background'][0], ConfigJson.PATH_JOB_IMAGES + mainImage, true);
            onModified();
        }
    }

    function createBlog() {
        let json = Templates.BLOG_PAGE;
        let mainImage = 'banner_blog.' + Images.getImageFormatById(customFields['photo'][0]);

        json.name = wpDoc['slug'];
        json.title = customFields['title'][0];
        json.keywords = customFields['title'][0];
        json.description = customFields['description'][0];
        json.page_title = customFields['page_title'][0];
        json.page_text = "<span class='inline-text'>" + customFields['page_text'][0] + "</span>";
        json.page_background = '/' + ConfigJson.PATH_BLOG + mainImage;
        json.alt = Images.getImageAltById(customFields['photo'][0]);

        Utils.writeJsonFile(ConfigJson.PATH_TO_JSON_DATA, 'blog.json', json, true);

        if (isModified === true) {
            if (state['fileName'] != 'blog-page.json') {
                Utils.removeFile(ConfigJson.PATH_TO_JSON_DATA, 'blog-page.json', true);
                setStateFilename(wpDoc['title'] + '.json');
            }
            Images.loadImgById(customFields['photo'][0], ConfigJson.PATH_BLOG + mainImage, true);
            onModified();
        }
    }

    switch (wpDoc['categories'][0]['slug']) {
        /!*case "product": {
            createProduct();
        }
            break;*!/
        /!*case "post": {
            createPost();
        }
            break;*!/
        /!*case "testimonial": {
            createTestimonial();
        }
            break;*!/
    }
    switch (pageId) {
        /!*case 733: {
            createOurApproach();
        }
            break;*!/
        /!*case 78: {
            createPortfolio();
        }
            break;*!/
        /!*case 121: {
            createTestimonials();
        }
            break;*!/
        /!*case 763: {
            createVacancies();
        }
            break;*!/
        /!*case 73: {
            createBlog();
        }
            break;*!/
    }
    State.updateState(pageId, state);
};

exports.formPage = formPage;
exports.saveAllFiles = saveAllFiles;*/