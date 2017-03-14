'use strict';
var exports = module.exports = {};

const State = require('./stateController/stateController');
const LinksMap = require('./dataGenerator/projectLinksWorker');

const Post = require('./dataGenerator/pages/post');
const Product = require('./dataGenerator/pages/product');
const Portfolio = require('./dataGenerator/pages/portfolio');
const Testimonials = require('./dataGenerator/pages/testimonials');
const Approach = require('./dataGenerator/pages/our-approach');
const Vacancies = require('./dataGenerator/pages/vacancies');
const Blog = require('./dataGenerator/pages/blog');


const creatingSiteContent = ((response) => {
    State.stateInit();
    LinksMap.createProjectsLinksMap(response['posts']);
    response['posts'].map((wpDoc) => {
        const isPostModified = State.createNewStateIfPageModified(wpDoc);
        createPage(wpDoc, isPostModified);
    });
    Testimonials.saveTestimonialsFile();
    Portfolio.writePortfolioFile();
    State.deleteIds();
});

function createPage(wpDoc, modified) {
    const pageData = createPageData(wpDoc, modified);

    switch (wpDoc['categories'][0]['slug']) {
        case "post": {
            Post.postWorker(pageData);
        }
            break;
        case "product": {
            Product.productWorker(pageData);
        }
            break;
        case "testimonial": {
            Testimonials.testimonialWorker(pageData);
        }
            break;
    }

    switch (wpDoc['id']) {
        case 121: {
            Testimonials.testimonialsPageWorker(pageData);
        }
            break;
        case 733: {
            Approach.ourApproachWorker(pageData);
        }
            break;
        case 763: {
            Vacancies.vacanciesWorker(pageData);
        }
            break;
        case 73: {
            Blog.blogWorker(pageData);
        }
            break;
        case 78: {
            Portfolio.portfolioWorker(pageData);
        }
            break;
    }


    /*let pages = {
     post: (() => { return Post.postWorker(pageData) }),
     product: (() => { return Product.productWorker(pageData) })
     };

     const type = wpDoc['categories'][0]['slug'];
     if(type == 'post' || 'product')
     pages[type].call();*/
}

function createPageData(wpDoc, modified) {
    return {
        slug: wpDoc['slug'],
        title: wpDoc['title'],
        customFields: wpDoc['custom_fields'],
        pageId: wpDoc['id'],
        pageDate: wpDoc['date'],
        modified: modified,
        content: wpDoc['content']
    }
}
exports.creatingSiteContent = creatingSiteContent;