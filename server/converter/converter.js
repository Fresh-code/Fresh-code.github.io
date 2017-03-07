'use strict';
var exports = module.exports = {};

const Utils = require('./utils/utils');
const State = require('./stateController/stateController');
const LinksMap = require('./dataGenerator/projectLinksWorker');
const Creator = require('./dataGenerator/pageConverter');


let creatingSiteContent = function (response) {
    State.stateInit();
    LinksMap.createProjectsLinksMap(response);

    response['posts'].forEach(function (wpDoc, index) {
        let modified = false;
        let wpDocSlug = Utils.getClearName(wpDoc['slug']);
        let wpDocName = Utils.getClearName(wpDoc['title']);
        let state = State.getState(wpDoc.id);

        if (state) {
            if (state.modified != wpDoc.modified) modified = true;
        }
        else {
            modified = true;
            state = State.createNewState(wpDoc.id, wpDoc['categories'][0]['slug'], wpDocName, wpDoc['date'], wpDoc['modified'], wpDoc['slug']);
        }

        Creator.formPage(wpDoc, state, modified, wpDocSlug, wpDocName);

        if(index === response['posts'].length - 1){
            Creator.saveAllFiles();
        }
    });
    State.deleteIds();
};

exports.creatingSiteContent = creatingSiteContent;