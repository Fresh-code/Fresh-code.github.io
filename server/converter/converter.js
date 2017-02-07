var exports = module.exports = {};

require('shelljs/global');
var path = require("path");
var http = require('http');
var fs = require('fs');
var jsonfile = require('jsonfile');

var ConfigJson = require('./dataModels/config.json');
var Templates = require('./dataModels/templates.json');
var Utils = require('./utils/utils');
var State = require('./stateController/stateController');
var Images = require('./imageWorker/imageWorker');
var LinksMap = require('./utils/linksMapController');
var Update = require('./updateController/updateController');


var convert = function () {
    Images.getMediaFromWP(1);
};
var getPagesFromWP = function () {
    http.get(ConfigJson.URL_FOR_PAGES, function (res) {
        var body = "";
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            creatingSiteContent(JSON.parse(body));
        });
    }).on('error', function (err) {
        console.log(err);
    });
};

function creatingSiteContent(response) {

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
                '<div style="width:100%;text-align:' + '$1' + ';">' + '<img src="/img/blog-post/included_' + id + '_' + '$3' + '" alt="' + '$4' + '" />').replace(/<p>&nbsp;<\/p>/g, '<br>') + '\n' +
            '</div>';
    }

    var portfolioJson = Templates.PORTFOLIO_PAGE;
    var testimonialsJson = Templates.TESTIMONIAL_PAGE;

    State.stateInit();
    LinksMap.createProjectsLinksMap(response);

    response.posts.forEach(function (wpDoc) {
        var modified = false;
        var wpDocSlug = Utils.getClearName(wpDoc.slug);
        var wpDocName = Utils.getClearName(wpDoc.title);
        var state = State.getState(wpDoc.id);

        if (state) {
            if (state.modified != wpDoc.modified) modified = true;
        }
        else {
            state = State.createNewState(wpDoc.id, wpDoc.categories[0].slug, wpDocName, wpDoc.modified);
            modified = true;
        }

        if(modified === true){ Update.updatePageData(wpDoc, state, wpDocSlug, wpDocName) }

        switch (wpDoc.categories[0].slug) {
            case "product": {

                var cover_prod_img = 'work_' + wpDoc.id + 'p';
                var product = Templates.PRODUCT;

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
                product.prev = LinksMap.getProjectPrevLink(wpDoc.id);
                product.next = LinksMap.getProjectNextLink(wpDoc.id);

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
                var postName = Utils.createPostName(wpDoc.date, wpDocName);
                var background = Images.getImageFormatById(wpDoc.custom_fields.background[0]);
                var cover = 'post_' + wpDoc.id + 'c';
                var avatar = Images.getImageFormatById(wpDoc.custom_fields.author_image[0]);
                var recent = Images.getImageFormatById(wpDoc.custom_fields.recent[0]);

                // Генерируем .md документ
                var date = wpDoc.date.split(' ')[0];
                var json_blog_data =
                    '--- \n' +
                    'layout: post\n' +
                    'title: ' + wpDoc.custom_fields.title[0] + '\n' +
                    'description: ' + wpDoc.custom_fields.description[0] + '\n' +
                    'date: ' + wpDoc.date + ' \n' +
                    'permalink: ' + Utils.createPostLink(wpDoc.date, wpDocName) + '\n' +
                    'post-title: ' + wpDoc.custom_fields.title_post[0] + '\n' +
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
                    'author: ' + wpDoc.custom_fields.author[0] + '\n' +
                    'position: ' + wpDoc.custom_fields.position[0] + '\n' +
                    'share-image: /img/blog-post/banner_post_' + wpDoc.id + '.' + background + '\n' +
                    'share-description: ' + wpDoc.custom_fields.description[0] + '\n' +
                    'share-title: ' + wpDoc.custom_fields.title_post[0].replace(/\s/g,"$20") + '\n' +
                    '---' + '\n' + createPostContent(wpDoc.id, wpDoc.content);

                Utils.writeFile(ConfigJson.PATH_TO_POSTS, postName, json_blog_data);
                Utils.writeFile(ConfigJson.PATH_TO_WP_POSTS, postName, json_blog_data);
            }
                break;
            case "testimonial": {
                var link = wpDoc.custom_fields.link[0].match(/\:\"(\d*)\"/);
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

        function getApproachByNum(num) {
            return {
                "name": eval('wpDoc.custom_fields.approach_title_' + num + '[0]'),
                "text": eval('wpDoc.custom_fields.approach_' + num + '[0]'),
                "image": eval('wpDoc.custom_fields.approach_image_' + num + '[0]')
            };
        }
        function getVacancyByNum(num) {
            return {
                "title": eval('wpDoc.custom_fields.vacancy_name_' + num + '[0]'),
                "skills": eval('wpDoc.custom_fields.vacancy_skills_' + num + '[0]').split('\r\n')
            };
        }

        switch (wpDoc.id) {
            //our-approach
            case 733: {
                var ourApproach = {
                    "name": wpDoc.custom_fields.name[0],
                    "title": wpDoc.custom_fields.title[0],
                    "keywords": wpDoc.custom_fields.keywords[0],
                    "description": wpDoc.custom_fields.description[0],
                    "text": wpDoc.custom_fields.text[0],
                    "background": "our_approach/banner_approach." + Images.getImageFormatById(wpDoc.custom_fields.background[0]),
                    "alt": Images.getImageAltById(wpDoc.custom_fields.background[0]),
                    "short": []
                };
                for (var x = 1; x <= wpDoc.custom_fields.nums[0]; x++) {
                    var approach = getApproachByNum(x);
                    if (modified) {
                        Images.loadImgById(approach.image, "img/our_approach/icon_" + x, true);
                    }
                    ourApproach.short.push(
                        {
                            "name": approach.name,
                            "text": approach.text,
                            "icon": "our_approach/" + "icon_" + x + "." + Images.getImageFormatById(approach.image),
                            "alt": Images.getImageAltById(approach.image)
                        }
                    )
                }
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
                wpDoc.attachments.forEach(function (item) {
                    if (item.title == 'icon') {
                        testimonialsJson.icons[testimonialsJson.icons.length] =
                        {
                            "img": "/img/testimonials/" + Utils.getImageName(item.url),
                            "alt": item.description
                        };
                    }
                });

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
                var vacancies = {
                    "title": wpDoc.custom_fields.title[0],
                    "keywords": wpDoc.custom_fields.keywords[0],
                    "description": wpDoc.custom_fields.description[0],
                    "page-title": wpDoc.custom_fields.page_title[0],
                    "page-text": wpDoc.custom_fields.page_text[0],
                    "page-background": "/img/job/banner_job." + Images.getImageFormatById(wpDoc.custom_fields.page_background[0]),
                    "alt": Images.getImageAltById(wpDoc.custom_fields.page_background[0]),
                    "jobs": []
                };

                for (var k = 1; k <= wpDoc.custom_fields.nums[0]; k++) {
                    var vacancy = getVacancyByNum(k);
                    vacancies.jobs.push({
                        "title": vacancy.title,
                        "skills": vacancy.skills
                    });
                }
                Utils.writeJsonFile(ConfigJson.PATH_TO_JSON_DATA, 'job.json', vacancies, true);
            }
                break;
            //blog-page
            case 73: {
                var json = Templates.BLOG_PAGE;

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
    });

    State.deleteIds();
    Utils.writeJsonFile(ConfigJson.PATH_TO_JSON_DATA, 'portfolio.json', portfolioJson, true);
    Utils.writeJsonFile(ConfigJson.PATH_TO_JSON_DATA, 'testimonials.json', testimonialsJson, true);

    portfolioJson.works = [];
    testimonialsJson.short = [];
    testimonialsJson.icons = [];

}

exports.getPagesFromWP = getPagesFromWP;
exports.convert = convert;
