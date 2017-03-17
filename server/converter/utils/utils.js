'use strict';
var exports = module.exports = {};

const fs = require('fs');
const jsonfile = require('jsonfile');
const glob = require("glob");
const request = require('request');
const Config = require('../../config');

const wp_folder = Config.PATH.WP_DATA_FOLDER;
const root_folder = Config.PATH.ROOT;

const writeFile = (path, fileName, data, isTwoFolders) => {
    fs.writeFile(root_folder + path + fileName, data, function (err) {
        if (err) {
            console.log("ERROR WHILE WRITING FILE: " + err);
        }
    });
    if (isTwoFolders === true) {
        writeFile(wp_folder + path, fileName, data);
    }
};

const writeJsonFile = (path, fileName, data, isTwoFolders) => {
    jsonfile.writeFile(root_folder + path + fileName, data, {spaces: 2}, function (err) {
        if (err) {
            console.error("ERROR WHILE WRITING JSON FILE: " + err);
        }
    });
    if (isTwoFolders === true) {
        writeJsonFile(wp_folder + path, fileName, data);
    }
};

const removeFileFromSite = (path, fileName, isTwoFolders) => {

    function findFiles(pathToFile, callback) {
        glob(root_folder + pathToFile, function (err, data) {
            if (err) console.log("ERROR WHILE LOOKING FOR FILE: " + err);
            return callback(data);
        });
    }

    function removeFile(file) {
        fs.unlink(file, function (err) {
            if (err) console.log("ERROR DELETING FILE: " + err);
            console.log(file + " deleted");
        });
    }

    findFiles(path + fileName, (files) => {
        files.forEach((file) => {
            removeFile(file);
        });
    });
    if (isTwoFolders === true) {
        removeFileFromSite(wp_folder + path, fileName);
    }
};

const getClearName = (str) => {
    return str.replace(/\s/g, "-").replace(/[^a-zA-Z0-9\-_]/g, "");
};

const getImageName = (url) => {
    return url.replace(/(.*)\/(.*)/g, '$2');
};

const createPostFileName = (date, slug) => {
    return date.split(' ')[0] + '-' + slug + '.md';
};

const createProductName = (slug) => {
    return slug + '.json';
};

const createProductHtmlName = (slug) => {
    return slug + '.html';
};

const createFoldersIfNotExist = (folder) => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
    if (!fs.existsSync(wp_folder + folder)) {
        fs.mkdirSync(wp_folder+ folder);
    }
};

exports.writeFile = writeFile;
exports.writeJsonFile = writeJsonFile;
exports.removeFileFromSite = removeFileFromSite;
exports.getClearName = getClearName;
exports.getImageName = getImageName;
exports.createPostFileName = createPostFileName;
exports.createProductName = createProductName;
exports.createProductHtmlName = createProductHtmlName;
exports.createFoldersIfNotExist = createFoldersIfNotExist;