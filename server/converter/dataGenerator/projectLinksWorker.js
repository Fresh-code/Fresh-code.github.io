'use strict';
var exports = module.exports = {};

let productsLinksMap = {};

function getProjectLinksById(id) {
    return productsLinksMap[id] ? productsLinksMap[id] : {link: "/testimonials/"};
}

const createProjectsLinksMap = (products) => {
    productsLinksMap = {};
    let links = [];

    products.forEach((product) => {
        links[links.length] = {
            id: product['id'],
            link: '/' + product['slug'] + '/'
        };
    });

    for (let i = 0; i < links.length; i++) {
        const productId = links[i]['id'];

        productsLinksMap[productId] = {};
        productsLinksMap[productId]['link'] = links[i]['link'];

        if (i == 0) {
            productsLinksMap[productId]['prev'] = links[links.length - 1]['link'];
        } else {
            productsLinksMap[productId]['prev'] = links[i - 1]['link'];
        }
        if (i == links.length - 1) {
            productsLinksMap[productId]['next'] = links[0]['link'];
        } else {
            productsLinksMap[productId]['next'] = links[i + 1]['link'];
        }
    }
};

const getProjectLinkById = (id) => {
    return getProjectLinksById(id)['link'];
};

const getProjectLinks = (id) => {
    return getProjectLinksById(id);
};

exports.createProjectsLinksMap = createProjectsLinksMap;
exports.getProjectLinks = getProjectLinks;
exports.getProjectLinkById = getProjectLinkById;