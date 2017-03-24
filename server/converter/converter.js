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


const creatingSiteContent = (pagesDataFromWp) => {
    State.stateInit();
    LinksMap.createProjectsLinksMap(getPostsFromAllData(pagesDataFromWp));
    pagesDataFromWp.forEach((wpDoc) => {
        const isPostModified = State.createNewStateIfPageModified(wpDoc);
        createPage(wpDoc, isPostModified);
    });
    Testimonials.saveTestimonialsFile();
    Portfolio.writePortfolioFile();
    State.deleteIdsForDeletionFromState();
};

function createPage(wpDoc, modified) {
    const pageData = createPageData(wpDoc, modified);

    switch (wpDoc['categories'][0]['slug']) {
        case "post": {
            Post.postWorker(pageData);
        } break;
        case "product": {
            Product.productWorker(pageData);
        } break;
        case "testimonial": {
            Testimonials.testimonialWorker(pageData);
        } break;
    }

    switch (wpDoc['slug']) {
        case "testimonials-page": {
            Testimonials.testimonialsPageWorker(pageData);
        } break;
        case "our-approach": {
            Approach.ourApproachWorker(pageData);
        } break;
        case "job": {
            Vacancies.vacanciesWorker(pageData);
        } break;
        case "blog": {
            Blog.blogWorker(pageData);
        } break;
        case "portfolio": {
            Portfolio.portfolioWorker(pageData);
        } break;
    }
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

function getPostsFromAllData(data) {
    return data.filter((page) => {
        return page['categories'][0]['slug'] == "product";
    });
}

exports.creatingSiteContent = creatingSiteContent;