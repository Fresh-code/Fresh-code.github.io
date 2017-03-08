'use strict';
var exports = module.exports = {};

const Utils = require('./../utils/utils');

let projectsLinksMap = {};

function getProjectLinksById(id) {
    return projectsLinksMap[id] ? projectsLinksMap[id] : {link: "/testimonials/"};
}

let createProjectsLinksMap = function (response) {
    projectsLinksMap = {};
    let links = [];

    response['posts'].forEach(function (wpDoc) {
        if (wpDoc['categories'][0]['slug'] == 'product') {
            links[links.length] = {
                "id": wpDoc['id'],
                "link": '/' + Utils.getClearName(wpDoc['title']) + '/'
            };
        }
    });

    for (let i = 0; i < links.length; i++) {
        let projectId = links[i]['id'];
        projectsLinksMap[projectId] = {};
        projectsLinksMap[projectId]['link'] = links[i]['link'];

        if (i == 0) {
            projectsLinksMap[projectId]['prev'] = links[links.length - 1]['link'];
        } else {
            projectsLinksMap[projectId]['prev'] = links[i - 1]['link'];
        }
        if (i == links.length - 1) {
            projectsLinksMap[projectId]['next'] = links[0]['link'];
        } else {
            projectsLinksMap[projectId]['next']  = links[i + 1]['link'];
        }
    }
};
let getProjectLinkById = function (id) {
    return getProjectLinksById(id)['link'];
};
let getProjectLinks = function (id) {
    return getProjectLinksById(id);
};

exports.createProjectsLinksMap = createProjectsLinksMap;
exports.getProjectLinks = getProjectLinks;
exports.getProjectLinkById = getProjectLinkById;