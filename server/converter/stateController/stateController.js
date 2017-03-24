'use strict';
var exports = module.exports = {};

const jsonfile = require('jsonfile');
const Config = require('../../config.js');
const Utils = require('../utils/utils.js');

let previousSiteState = jsonfile.readFileSync(Config.PATH.ROOT + Config.PATH.STATE_DATA);
let idsForDeletion = [];

function writeState() {
    Utils.writeJsonFile(Config.PATH.WP_JSON_DATA, 'bd.json', previousSiteState);
}

const stateInit = () => {
    idsForDeletion = [];
    for (const stateId in previousSiteState) {
        if (previousSiteState.hasOwnProperty(stateId)) {
            idsForDeletion.push(stateId);
        }
    }
};

const getState = (id) => {
    if(previousSiteState[id]) {
        excludeFromIdsForDeletion(id);
        return previousSiteState[id];
    } else {
        return false;
    }
};

function excludeFromIdsForDeletion (id) {
    const index = idsForDeletion.indexOf(id.toString());
    if (index > -1) {
        idsForDeletion.splice(index, 1);
    }
}

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
};

const updateState = (id, state) => {
    previousSiteState[id] = state;
};

const deleteIdsForDeletionFromState = () => {
    idsForDeletion.forEach(function (id) {
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
exports.deleteIdsForDeletionFromState = deleteIdsForDeletionFromState;
exports.createNewStateIfPageModified = createNewStateIfPageModified;
exports.updateStateFilename = updateStateFilename;
exports.updateStateHtmlFilename = updateStateHtmlFilename;
exports.updateStateModifiedTime = updateStateModifiedTime;