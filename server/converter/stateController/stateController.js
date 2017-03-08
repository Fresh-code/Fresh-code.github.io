'use strict';
var exports = module.exports = {};

const jsonfile = require('jsonfile');
const ConfigJson = require('../dataModels/config.json');
const Utils = require('../utils/utils.js');

let previousSiteState = jsonfile.readFileSync(ConfigJson.PATH_TO_PREV_STATE);
let deletedIds = [];

function writeState() {
    Utils.writeJsonFile(ConfigJson.PATH_TO_DB, 'bd.json', previousSiteState);
}

let stateInit = function () {
    deletedIds = [];
    for (let stateId in previousSiteState) {
        if(previousSiteState.hasOwnProperty(stateId)) {
            deletedIds.push(stateId);
        }
    }
};
let getState = function (id) {
    let index = deletedIds.indexOf(id.toString());
    if(index > -1) {
        deletedIds.splice(index, 1);
    }
    return previousSiteState[id] ? previousSiteState[id] : false;
};
let createNewState = function (id, type, name, date, modified, slug) {
    previousSiteState[id] = {};
    if (type == "product") {
        previousSiteState[id] = {
            type: type,
            fileName: name + '.json',
            htmlFileName: name + '.html',
            modified: modified
        };
    } else if (type == "post") {
        previousSiteState[id] = {
            type: type,
            fileName: Utils.createPostName(date, slug),
            modified: modified
        };
    } else {
        previousSiteState[id] = {
            type: type,
            fileName: name + '.json',
            modified: modified
        };
    }
    return previousSiteState[id];
};
let updateState = function (id, state) {
    previousSiteState[id] = state;
};
let deleteIds = function () {
    deletedIds.forEach(function (id) {
        let state = previousSiteState[id];

        switch (state['type']) {
            case "product": {
                Utils.removeFile(ConfigJson.PATH_TO_HTML_PROJECTS, state['htmlFileName'], true);
                Utils.removeFile(ConfigJson.PATH_TO_JSON_PROJECTS, state['fileName'], true);
                delete previousSiteState[id];
            }
                break;
            case "post": {
                Utils.removeFile(ConfigJson.PATH_TO_POSTS, state['fileName'], true);
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

exports.stateInit = stateInit;
exports.getState = getState;
exports.createNewState = createNewState;
exports.updateState = updateState;
exports.deleteIds = deleteIds;