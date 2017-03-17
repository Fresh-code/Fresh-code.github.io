'use strict';
const Wp = require("../wpWorker/wpWorker");

function timeoutRedirect(res) {
    setTimeout(() => {
        res.end();
    }, 5000);
}
function pushCurrentChanges(res) {

    function runPushScript(cmd, args, cb, end) {
        const spawn = require('child_process').spawn,
            child = spawn(cmd, args),
            me = this;
        child.stdout.on('data', (buffer) => { cb(me, buffer) });
        child.stdout.on('end', end);
    }

    let foo = new runPushScript(
        'sh', ['server/sh-scripts/git-push.sh'],
        (me, buffer) => { me.stdout += (buffer.toString()) },
        () => { console.log(foo.stdout); res.send(foo.stdout); timeoutRedirect(res);}
    );
}

module.exports = function (app) {
    app.get('/build', (req, res) => {
        Wp.getAllDataFromWp();
        timeoutRedirect(res);
    });

    app.get('/push', (req, res) => {
        pushCurrentChanges(res);
        /*timeoutRedirect(res);*/
    });
};