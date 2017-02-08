'use strict';
const Converter = require("../converter/converter");

function timeoutRedirect(res) {
    setTimeout(function () {
        res.redirect('http://192.168.1.151:8000/wp-admin/edit.php');
        res.end();
    }, 5000);
}

module.exports = function (app) {
    app.get('/build', function (req, res) {
        Converter.convert();
        timeoutRedirect(res);
    });

    app.get('/push', function (req, res) {
        //exec('./git_push.sh');
        timeoutRedirect(res);
    });
};

