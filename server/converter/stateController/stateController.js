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
    previousSiteState.forEach(function (item) {
        deletedIds.push(item.id);
    });
};
let getState = function (id) {
    deletedIds.splice(deletedIds.indexOf(id), 1);

    for (let i = 0; i < previousSiteState.length; i++) {
        if (typeof previousSiteState[i].id == 'number' && previousSiteState[i].id == id) {
            return previousSiteState[i];
        }
    }
    return false;
};
let createNewState = function (id, type, name, modified) {
    if (type == "product") {
        previousSiteState[previousSiteState.length] = {
            id: id,
            type: type,
            fileName: name + '.json',
            htmlFileName: name + '.html',
            modified: modified
        };
    } else {
        previousSiteState[previousSiteState.length] = {
            id: id,
            type: type,
            fileName: name + '.json',
            modified: modified
        };
    }
    return previousSiteState[previousSiteState.length - 1];
};
let updateState = function (state) {
    previousSiteState.forEach(function (oldState, index) {
        if(oldState.id === state.id){
            previousSiteState[index] = state;
        }
    });
};
let deleteIds = function () {
    deletedIds.forEach(function (id) {
        previousSiteState.forEach(function (state, index) {
            if (state.id == id) {
                switch (state.type) {
                    case "product": {
                        Utils.removeFile(ConfigJson.PATH_TO_HTML_PROJECTS, state.htmlFileName, true);
                        Utils.removeFile(ConfigJson.PATH_TO_JSON_PROJECTS, state.fileName, true);
                        previousSiteState.splice(index, 1);
                    }
                        break;
                    case "post": {
                        Utils.removeFile(ConfigJson.PATH_TO_POSTS, state.fileName, true);
                        previousSiteState.splice(index, 1);
                    }
                        break;
                    case "testimonial": {
                        previousSiteState.splice(index, 1);
                    }
                        break;
                }
            }
        });
    });
    writeState();
};

exports.stateInit = stateInit;
exports.getState = getState;
exports.createNewState = createNewState;
exports.updateState = updateState;
exports.deleteIds = deleteIds;