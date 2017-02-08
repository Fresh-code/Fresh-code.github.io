'use strict';
var exports = module.exports = {};

const path = require("path");
const fs = require('fs');
const jsonfile = require('jsonfile');
const glob = require("glob");
const request = require('request');

function deleteCacheString(fileName) {
    exec("sed -i '/\b\(" + fileName + "\)\b/d' /src/_assets-cache/cache.yml");
}

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
let removeDir = function (dirPath) {
    let files = null;
    try {
        files = fs.readdirSync('/src/' + dirPath);
    }
    catch (e) {
        console.log("ERROR WHILE REMOVING FOLDER: " + e);
        return;
    }
    if (files.length > 0)
        for (let i = 0; i < files.length; i++) {
            let filePath = dirPath + '/' + files[i];
            if (fs.statSync(filePath).isFile())
                fs.unlinkSync(filePath);
            else
                removeDir(filePath);
        }
    fs.rmdirSync(dirPath);
    deleteCacheString(dirPath);

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
    deleteCacheString(fileName);
};
let removePostImages = function (id) {
    removeFile('img/blog-post/', 'banner_post_' + id + '.*', true);
    removeFile('img/blog-post/', 'post_author_' + id + '.*', true);
    removeFile('img/blog-post/', 'recent_post_' + id + '.*', true);
    removeFile('img/blog-post/', 'post_' + id + 'c.*', true);
    removeFile('img/blog-post/', 'included_' + id + '*', true);
};
let getClearName = function (str) {
    return str.replace(/\s/g, "-").replace(/[^a-zA-Z0-9\-\_]/g, "");
};
let getImageName = function (url) {
    return url.replace(/(.*)\/(.*)/g, '$2');
};
let createPostName = function (date, name) {
    return date.split(' ')[0] + '-' + getClearName(name.toLowerCase().replace(/\W+/g, "-")) + '.md';
};
let createPostLink = function (date, name) {
    return '/blog/' + (date.split(' ')[0]).replace(/\-/g, "/") + '/' + getClearName(name.toLowerCase().replace(/\W+/g, "-")) + '/';
};

exports.writeFile = writeFile;
exports.writeJsonFile = writeJsonFile;
exports.removePostImages = removePostImages;
exports.removeDir = removeDir;
exports.removeFile = removeFile;
exports.getClearName = getClearName;
exports.getImageName = getImageName;
exports.createPostName = createPostName;
exports.createPostLink = createPostLink;