'use strict';
const path = require('path');

module.exports = Object.freeze({
    STAGING_URL: "http://192.168.1.151:8000",
    POSTS_URL: "/?json=get_posts",
    MEDIA_PORTION_URL: "/wp-json/wp/v2/media/?per_page=100",
    PATH: {
        ROOT: __dirname+ '/../',
        TEMPLATES: "server/converter/dataModels/html-templates/template",
        STATE_DATA: "wp-data/_data/bd.json",
        WP_DATA_FOLDER: "wp-data/",


        BLOG: "img/blog/",
        POSTS: "_posts/",
        JSON_DATA: "_data/",
        JSON_PROJECTS: "_data/center-layout/",
        HTML_PROJECTS: "_pages/",

        IMAGES: "img/",
        JOB_IMAGES: "img/job/",
        BLOG_IMAGES: "img/blog-post/",
        APPROACH_IMAGES: "img/our_approach/",
        PORTFOLIO_IMAGES: "img/portfolio/",
        TESTIMONIALS_IMAGES: "img/testimonials/",


        WP_BLOG: "wp-data/blog/",
        WP_POSTS: "wp-data/_posts/",
        WP_JSON_DATA: "wp-data/_data/",
        WP_JSON_PROJECTS: "wp-data/_data/center-layout/",
        WP_HTML_PROJECTS: "wp-data/_pages/",

        WP_IMAGES: "wp-data/img/",
        WP_JOB_IMAGES: "wp-data/img/job/",
        WP_BLOG_IMAGES: "wp-data/img/blog-post/",
        WP_APPROACH_IMAGES: "wp-data/img/our_approach/",
        WP_PORTFOLIO_IMAGES: "wp-data/img/portfolio/",
        WP_TESTIMONIALS_IMAGES: "wp-data/img/testimonials/"
    }
});