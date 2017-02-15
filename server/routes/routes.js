'use strict';
const Wp = require("../wpWorker/wpWorker");

function timeoutRedirect(res) {
    setTimeout(function () {
        res.end();
    }, 5000);
}
function pushCurrentChanges() {
    require('child_process').spawn('sh', ['server/git-push.sh'], {stdio: 'inherit'});
}

module.exports = function (app) {
    app.get('/build', function (req, res) {
        Wp.getMediaFromWP();
        timeoutRedirect(res);
    });

    app.get('/push', function (req, res) {
        pushCurrentChanges();
        timeoutRedirect(res);
    });
};