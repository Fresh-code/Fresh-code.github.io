'use strict';
var exports = module.exports = {};

const jsonfile = require('jsonfile');
const Config = require('../../config.js');
const Utils = require('../utils/utils.js');

let previousSiteState = jsonfile.readFileSync(Config.PATH.STATE_DATA);
let deletedIds = [];

function writeState() {
    Utils.writeJsonFile(Config.PATH.WP_JSON_DATA, 'bd.json', previousSiteState);
}

const stateInit = () => {
    deletedIds = [];
    for (const stateId in previousSiteState) {
        if (previousSiteState.hasOwnProperty(stateId)) {
            deletedIds.push(stateId);
        }
    }
};

const getState = (id) => {
    const index = deletedIds.indexOf(id.toString());
    if (index > -1) {
        deletedIds.splice(index, 1);
    }
    return previousSiteState[id] ? previousSiteState[id] : false;
};

const createNewState = (id, type, slug, date, modified) => {
    previousSiteState[id] = {
        type: type,
        modified: modified
    };

    if (type == "product") {
        previousSiteState[id].fileName = Utils.createProductName(slug);
        previousSiteState[id].htmlFileName = Utils.createProductHtmlName(slug);
    } else if (type == "post") {
        previousSiteState[id].fileName = Utils.createPostFileName(date, slug);
    } else {
        previousSiteState[id].fileName = slug + '.json';
    }

    return previousSiteState[id];
};
const updateState = (id, state) => {
    previousSiteState[id] = state;
};

const deleteIdsFromStae = () => {
    deletedIds.forEach(function (id) {
        const state = previousSiteState[id];

        switch (state['type']) {
            case "product": {
                Utils.removeFileFromSite(Config.PATH.HTML_PROJECTS, state['htmlFileName'], true);
                Utils.removeFileFromSite(Config.PATH.JSON_PROJECTS, state['fileName'], true);
                delete previousSiteState[id];
            }
                break;
            case "post": {
                Utils.removeFileFromSite(Config.PATH.POSTS, state['fileName'], true);
                delete previousSiteState[id];
            }
                break;
            case "testimonial": {
                delete previousSiteState[id];
            }
                break;
        }
    });
    writeState();
};

const createNewStateIfPageModified = (wpDoc) => {
    let modified = false;
    let state = getState(wpDoc['id']);
    if (state) {
        if (state['modified'] != wpDoc['modified']) {
            modified = true;
            state['modified'] = wpDoc['modified'];
        }
    }
    else {
        modified = true;
        createNewState(wpDoc['id'], wpDoc['categories'][0]['slug'], wpDoc['slug'], wpDoc['date'], wpDoc['modified']);
    }
    return modified;
};

const updateStateFilename = (pageId, fileName) => {
    previousSiteState[pageId]['fileName'] = fileName;
};

const updateStateHtmlFilename = (pageId, htmlFileName) => {
    previousSiteState[pageId]['htmlFileName'] = htmlFileName;
};

const updateStateModifiedTime = (pageId, modified) => {
    previousSiteState[pageId]['modified'] = modified;
};


exports.stateInit = stateInit;
exports.getState = getState;
exports.createNewState = createNewState;
exports.updateState = updateState;
exports.deleteIdsFromStae = deleteIdsFromStae;
exports.createNewStateIfPageModified = createNewStateIfPageModified;
exports.updateStateFilename = updateStateFilename;
exports.updateStateHtmlFilename = updateStateHtmlFilename;
exports.updateStateModifiedTime = updateStateModifiedTime;