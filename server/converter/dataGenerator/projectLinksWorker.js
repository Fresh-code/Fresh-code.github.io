'use strict';
var exports = module.exports = {};

const Utils = require('./../utils/utils');


let projectsLinksMap = [];

function getProjectLinksById(id) {
    for (let i = 0; i < projectsLinksMap.length; i++) {
        if (projectsLinksMap[i].id == id) {
            return projectsLinksMap[i];
        }
    }
    return {link: "/testimonials/"};
}

let createProjectsLinksMap = function (response) {
    projectsLinksMap = [];

    response.posts.forEach(function (wpDoc) {
        if (wpDoc.categories[0].slug == 'product') {
            projectsLinksMap[projectsLinksMap.length] = {
                "id": wpDoc.id,
                "link": '/' + Utils.getClearName(wpDoc.title) + '/',
                "prev": "",
                "next": ""
            };
        }
    });

    for (let i = 0; i < projectsLinksMap.length; i++) {
        if (i == 0) {
            projectsLinksMap[i].prev = projectsLinksMap[projectsLinksMap.length - 1].link;
        } else {
            projectsLinksMap[i].prev = projectsLinksMap[i - 1].link;
        }
        if (i == projectsLinksMap.length - 1) {
            projectsLinksMap[i].next = projectsLinksMap[0].link;
        } else {
            projectsLinksMap[i].next = projectsLinksMap[i + 1].link;
        }
    }
};
let getProjectLinkById = function (id) {
    return getProjectLinksById(id).link;
};
let getProjectLinks = function (id) {
    let links = getProjectLinksById(id);
    return {prev: links.prev, next: links.next};
};

exports.createProjectsLinksMap = createProjectsLinksMap;
exports.getProjectLinks = getProjectLinks;
exports.getProjectLinkById = getProjectLinkById;