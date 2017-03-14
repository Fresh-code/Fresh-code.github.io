'use strict';
var exports = module.exports = {};

const path = require("path");
const fs = require('fs');
const jsonfile = require('jsonfile');
const glob = require("glob");
const request = require('request');

let writeFile = function (path, fileName, data, isTwoFolders) {
    fs.writeFile('/src/' + path + fileName, data, function (err) {
        if (err) {
            console.log("ERROR WHILE WRITING FILE: " + err);
        }
    });
    if (isTwoFolders === true) {
        writeFile('wp-data/' + path, fileName, data);
    }
};

let writeJsonFile = function (path, fileName, data, isTwoFolders) {
    jsonfile.writeFile('/src/' + path + fileName, data, {spaces: 2}, function (err) {
        if (err) {
            console.error("ERROR WHILE WRITING JSON FILE: " + err);
        }
    });
    if (isTwoFolders === true) {
        writeJsonFile('wp-data/' + path, fileName, data);
    }
};

let removeFile = function (path, fileName, isTwoFolders) {
    glob('/src/' + path + fileName, function (err, files) {
        if (err) console.log("ERROR WHILE REMOVING FILE: " + err);
        files.forEach(function (item) {
            console.log(item + " found");
        });
        files.forEach(function (item) {
            fs.unlink(item, function (err) {
                if (err) throw err;
                console.log(item + " deleted");
            });
        });
    });
    if (isTwoFolders === true) {
        removeFile('wp-data/' + path, fileName);
    }
};

let getClearName = function (str) {
    return str.replace(/\s/g, "-").replace(/[^a-zA-Z0-9\-_]/g, "");
};

let getImageName = function (url) {
    return url.replace(/(.*)\/(.*)/g, '$2');
};

const createPostFileName = ((date, slug) => {
    return date.split(' ')[0] + '-' + slug + '.md';
});

const createProductName = ((slug) => {
    return slug + '.json';
});

const createProductHtmlName = ((slug) => {
    return slug + '.html';
});


exports.writeFile = writeFile;
exports.writeJsonFile = writeJsonFile;
exports.removeFile = removeFile;
exports.getClearName = getClearName;
exports.getImageName = getImageName;
exports.createPostFileName = createPostFileName;
exports.createProductName = createProductName;
exports.createProductHtmlName = createProductHtmlName;