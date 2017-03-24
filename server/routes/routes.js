'use strict';
const Wp = require("../wpWorker/wpWorker");

function timeoutRedirect(res) {
    setTimeout(() => {
        res.end();
    }, 5000);
}

function pushCurrentChanges() {
    require('child_process').spawn('sh', ['server/sh-scripts/git-push.sh'], {stdio: 'inherit'});
}

module.exports = function (app) {
    app.get('/build', (req, res) => {
        Wp.getAllDataFromWp();
        timeoutRedirect(res);
    });

    app.get('/push', (req, res) => {
        pushCurrentChanges(res);
        timeoutRedirect(res);
    });
};