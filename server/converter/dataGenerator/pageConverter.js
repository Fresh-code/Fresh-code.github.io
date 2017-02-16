'use strict';
var exports = module.exports = {};

const ConfigJson = require('../dataModels/config.json');
const Templates = require('../dataModels/templates.json');
const Utils = require('../utils/utils');
const Images = require('./imageWorker');
const LinksMap = require('./projectLinksWorker');

let portfolioJson = Templates.PORTFOLIO_PAGE;
let testimonialsJson = Templates.TESTIMONIAL_PAGE;

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
function createPostContent(id, content) {
    return '<div class="post-body p-t-6rem">' +
        '' + content.replace(/<img.*align(.*)".*src="http(.*)\/(.*)".alt="(.*)".width.*>/g,
            '<div style="text-align:' + '$1' + ';">' +
            '<img src="/img/blog-post/included_' + id + '_' + '$3' + '" alt="' + '$4' + '" style="max-width: 100%" />').replace(/<p>&nbsp;<\/p>/g, '<br>') + '\n' +
        '</div>';
}
function fixColon(str) {
    return str.replace(/\:/g, "&#58;");
}
let saveAllFiles = function () {
    Utils.writeJsonFile(ConfigJson.PATH_TO_JSON_DATA, 'portfolio.json', portfolioJson, true);
    Utils.writeJsonFile(ConfigJson.PATH_TO_JSON_DATA, 'testimonials.json', testimonialsJson, true);

    portfolioJson.works = [];
    testimonialsJson.short = [];
    testimonialsJson.icons = [];
};

let formPage = function (wpDoc, wpDocSlug, wpDocName) {
    switch (wpDoc.categories[0].slug) {
        case "product": {

            let cover_prod_img = 'work_' + wpDoc.id + 'p';
            let product = Templates.PRODUCT;
            let links = LinksMap.getProjectLinks(wpDoc.id);

            product.name = wpDocName;
            product.client = wpDoc.custom_fields.client[0];
            product.title = wpDoc.custom_fields.title[0];
            product.description = wpDoc.custom_fields.description[0];
            product.site = wpDoc.custom_fields.site[0];
            product.link = wpDoc.custom_fields.link[0];
            product.industry = wpDoc.custom_fields.industry[0];
            product.country = wpDoc.custom_fields.country[0];
            product.teamSize = wpDoc.custom_fields.teamsize[0];
            product.techUsed = wpDoc.custom_fields.techused[0];
            product.projDuration = wpDoc.custom_fields.projduration[0];
            product.pdf = wpDoc.custom_fields.pdf[0];
            product.workStages = wpDoc.custom_fields.workstages[0];
            product.body_color = wpDoc.custom_fields.body_color[0];
            product.images[0].alt = Images.getImageAltById(wpDoc.custom_fields.first[0]);
            product.images[0].img = "/img/" + wpDocSlug + "/" + 'work_first_img_' + wpDoc.id + 'p.' + Images.getImageFormatById(wpDoc.custom_fields.first[0]);
            product.images[1].alt = Images.getImageAltById(wpDoc.custom_fields.second[0]);
            product.images[1].img = "/img/" + wpDocSlug + "/" + 'work_second_img_' + wpDoc.id + 'p.' + Images.getImageFormatById(wpDoc.custom_fields.second[0]);
            product.images[2].alt = Images.getImageAltById(wpDoc.custom_fields.third[0]);
            product.images[2].img = "/img/" + wpDocSlug + "/" + 'work_third_img_' + wpDoc.id + 'p.' + Images.getImageFormatById(wpDoc.custom_fields.third[0]);
            product.challenges = wpDoc.custom_fields.challenges[0];
            product.buisValue = wpDoc.custom_fields.buisvalue[0];
            product.solutions = wpDoc.custom_fields.solutions[0];
            product.prev = links.prev;
            product.next = links.next;

            Utils.writeJsonFile(ConfigJson.PATH_TO_JSON_PROJECTS, product.name + '.json', product, true);

            portfolioJson.works[portfolioJson.works.length] = {
                "title": wpDoc.custom_fields.preview_title[0],
                "description": wpDoc.custom_fields.preview_description[0],
                "cover": "/img/portfolio/" + cover_prod_img + "-350.jpg",
                "alt": Images.getImageAltById(wpDoc.custom_fields.cover[0]),
                "srcsetattr": "/img/portfolio/" + cover_prod_img + "-700.jpg 700w, /img/portfolio/" + cover_prod_img + "-450.jpg 450w, /img/portfolio/" + cover_prod_img + "-350.jpg 350w",
                "sizesattr": "(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px",
                "link": '/' + wpDocName,
                "type": wpDoc.custom_fields.preview_type[0],
                "mainColor": wpDoc.custom_fields.preview_maincolor[0]
            };
        }
            break;
        case "post": {
            let postName = Utils.createPostName(wpDoc.date, wpDocName);
            let background = Images.getImageFormatById(wpDoc.custom_fields.background[0]);
            let cover = 'post_' + wpDoc.id + 'c';
            let avatar = Images.getImageFormatById(wpDoc.custom_fields.author_image[0]);
            let recent = Images.getImageFormatById(wpDoc.custom_fields.recent[0]);

            // Генерируем .md документ
            let date = wpDoc.date.split(' ')[0];
            let json_blog_data =
                '--- \n' +
                'layout: post\n' +
                'title: ' + fixColon(wpDoc.custom_fields.title[0]) + '\n' +
                'description: ' + fixColon(wpDoc.custom_fields.description[0]) + '\n' +
                'date: ' + wpDoc.date + ' \n' +
                'permalink: ' + Utils.createPostLink(wpDoc.date, wpDocName) + '\n' +
                'post-title: ' + fixColon(wpDoc.custom_fields.title_post[0]) + '\n' +
                'categories-tag: ' + getCategory(wpDoc.custom_fields.tag_type[0]) + '\n' +
                'background: /img/blog-post/banner_post_' + wpDoc.id + '.' + background + '\n' +
                'recent-cover: /img/blog-post/recent_post_' + wpDoc.id + '.' + recent + '\n' +
                'background-color: "' + wpDoc.custom_fields.background_color[0] + '"\n' +
                'type: ' + wpDoc.custom_fields.tag_type[0] + '\n' +
                'cover: /img/blog-post/' + cover + '-350.jpg \n' +
                'srcsetattr: /img/blog-post/' + cover + '-700.jpg 700w, /img/blog-post/' + cover + '-450.jpg 450w, /img/blog-post/' + cover + '-350.jpg 350w \n' +
                'sizeattr: "(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px"' + '\n' +
                'background-cover: "' + wpDoc.custom_fields.background_color[0] + '"\n' +
                'avatar: /img/blog-post/post_author_' + wpDoc.id + '.' + avatar + '\n' +
                'author: ' + fixColon(wpDoc.custom_fields.author[0]) + '\n' +
                'position: ' + fixColon(wpDoc.custom_fields.position[0]) + '\n' +
                'share-image: /img/blog-post/banner_post_' + wpDoc.id + '.' + background + '\n' +
                'share-description: ' + fixColon(wpDoc.custom_fields.description[0]) + '\n' +
                'share-title: ' + fixColon(wpDoc.custom_fields.title_post[0].replace(/\s/g, "$20")) + '\n' +
                '---' + '\n' + createPostContent(wpDoc.id, wpDoc.content);

            Utils.writeFile(ConfigJson.PATH_TO_POSTS, postName, json_blog_data, true);
        }
            break;
        case "testimonial": {
            let link = wpDoc.custom_fields.link[0].match(/\:\"(\d*)\"/);
            testimonialsJson.short[testimonialsJson.short.length] = {
                //alt текст берертся как имя автора
                "author": wpDoc.custom_fields.author[0],
                "company": wpDoc.custom_fields.company[0],
                "text": wpDoc.custom_fields.text[0],
                "photo": '/img/testimonials/testimonial_author_' + wpDoc.id + '.' + Images.getImageFormatById(wpDoc.custom_fields.photo),
                "link": LinksMap.getProjectLinkById(link[1])
            };
        }
            break;
    }

    switch (wpDoc.id) {
        //our-approach
        case 733: {
            let ourApproach = {
                "name": wpDoc.custom_fields.name[0],
                "title": wpDoc.custom_fields.title[0],
                "keywords": wpDoc.custom_fields.keywords[0],
                "description": wpDoc.custom_fields.description[0],
                "text": wpDoc.custom_fields.text[0],
                "background": "our_approach/banner_approach." + Images.getImageFormatById(wpDoc.custom_fields.background[0]),
                "alt": Images.getImageAltById(wpDoc.custom_fields.background[0]),
                "short": []
            };

            let arr = [];
            for (let i = 0; i < wpDoc.custom_fields.approach[0]; i++) {
                arr[i] = {};
            }
            let regex = /approach\_(\d)\_.*/;
            let regex_title = /approach\_(\d)\_title/;
            let regex_text = /approach\_(\d)\_text/;
            let regex_image = /approach\_(\d)\_image/;
            for (let key in wpDoc.custom_fields) {
                if (wpDoc.custom_fields.hasOwnProperty(key)) {
                    if (regex.test(key)) {
                        let index = key.replace(/approach\_(\d)\_.*/, "$1");
                        if (regex_title.test(key)) {
                            arr[index].name = wpDoc.custom_fields[key][0];
                        } else if (regex_text.test(key)) {
                            arr[index].text = wpDoc.custom_fields[key][0];
                        } else if (regex_image.test(key)) {
                            Images.loadImgById(wpDoc.custom_fields[key][0], "img/our_approach/icon_" + index, true);
                            arr[index].icon = "our_approach/" + "icon_" + index + "." + Images.getImageFormatById(wpDoc.custom_fields[key][0]);
                            arr[index].alt = Images.getImageAltById(wpDoc.custom_fields[key][0]);
                        }
                    }
                }
            }
            ourApproach.short = arr;
            Utils.writeJsonFile(ConfigJson.PATH_TO_JSON_DATA, 'our-approach.json', ourApproach, true);
        }
            break;
        //portfolio-page
        case 78: {
            portfolioJson.title = wpDoc.custom_fields.title[0];
            portfolioJson.keywords = wpDoc.custom_fields.keywords[0];
            portfolioJson.description = wpDoc.custom_fields.description[0];
            portfolioJson.page_title = wpDoc.custom_fields.page_title[0];
            portfolioJson.page_text = "<span class='inline-text'>" + wpDoc.custom_fields.page_text[0] + "</span>";
            portfolioJson.page_textbot = "<span class='inline-text'>" + wpDoc.custom_fields.page_textbot[0] + "</span>";
            portfolioJson.page_background = "/img/portfolio/banner_portfolio." + Images.getImageFormatById(wpDoc.custom_fields.photo[0]);
            portfolioJson.alt = Images.getImageAltById(wpDoc.custom_fields.photo[0]);
        }
            break;
        //testimonials-page
        case 121: {

            if (wpDoc.custom_fields.proj_images[0] != undefined) {
                let projectIcons = wpDoc.custom_fields.proj_images[0].split(",");
                projectIcons.forEach(function (id) {
                    testimonialsJson.icons[testimonialsJson.icons.length] =
                        {
                            "img": "/img/testimonials/icon_" + id + '.' + Images.getImageFormatById(id),
                            "alt": Images.getImageAltById(id)
                        };
                });
            }

            testimonialsJson.title = wpDoc.custom_fields.title[0];
            testimonialsJson.keywords = wpDoc.custom_fields.keywords[0];
            testimonialsJson.description = wpDoc.custom_fields.description[0];
            testimonialsJson.page_title = wpDoc.custom_fields.page_title[0];
            testimonialsJson.page_text = "<span class='inline-text'>" + wpDoc.custom_fields.page_text[0] + "</span>";
            testimonialsJson.page_background = "/img/testimonials/banner_testimonials." + Images.getImageFormatById(wpDoc.custom_fields.photo[0]);
            testimonialsJson.alt = Images.getImageAltById(wpDoc.custom_fields.photo[0]);
        }
            break;
        //vacancies-page
        case 763: {
            let vacancies = {
                "title": wpDoc.custom_fields.title[0],
                "keywords": wpDoc.custom_fields.keywords[0],
                "description": wpDoc.custom_fields.description[0],
                "page-title": wpDoc.custom_fields.page_title[0],
                "page-text": wpDoc.custom_fields.page_text[0],
                "page-background": "/img/job/banner_job." + Images.getImageFormatById(wpDoc.custom_fields.page_background[0]),
                "alt": Images.getImageAltById(wpDoc.custom_fields.page_background[0]),
                "jobs": []
            };

            let arr = [];
            for (let i = 0; i < wpDoc.custom_fields.vacansies[0]; i++) {
                arr[i] = {};
            }
            let regex = /vacansies\_(\d)\_.*/;
            let regex_title = /vacansies\_(\d)\_title/;
            let regex_skills = /vacansies\_(\d)\_skills/;
            for (let key in wpDoc.custom_fields) {
                if (wpDoc.custom_fields.hasOwnProperty(key)) {
                    if (regex.test(key)) {
                        let index = key.replace(/vacansies\_(\d)\_.*/, "$1");
                        if (regex_title.test(key)) {
                            arr[index].title = wpDoc.custom_fields[key][0];
                        } else if (regex_skills.test(key)) {
                            arr[index].skills = wpDoc.custom_fields[key][0].split('\r\n');
                        }
                    }
                }
            }
            vacancies.jobs = arr;
            Utils.writeJsonFile(ConfigJson.PATH_TO_JSON_DATA, 'job.json', vacancies, true);
        }
            break;
        //blog-page
        case 73: {
            let json = Templates.BLOG_PAGE;

            json.name = wpDoc.slug;
            json.title = wpDoc.custom_fields.title[0];
            json.keywords = wpDoc.custom_fields.title[0];
            json.description = wpDoc.custom_fields.description[0];
            json.page_title = wpDoc.custom_fields.page_title[0];
            json.page_text = "<span class='inline-text'>" + wpDoc.custom_fields.page_text[0] + "</span>";
            json.page_background = "/img/blog/banner_blog." + Images.getImageFormatById(wpDoc.custom_fields.photo[0]);
            json.alt = Images.getImageAltById(wpDoc.custom_fields.photo[0]);

            Utils.writeJsonFile(ConfigJson.PATH_TO_JSON_DATA, 'blog.json', json, true);
        }
            break;
    }
};

exports.formPage = formPage;
exports.saveAllFiles = saveAllFiles;