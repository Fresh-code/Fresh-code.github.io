'use strict';

require('shelljs/global');
const http = require('http');
const fs = require('fs');

const writeF = function (path, fileName, data) {
    fs.writeFile(path + fileName, data, function (err) {
        if (err) {
            console.log(err);
        }
    });
};

//getting ssh key, which stores in wordpress
http.get('http://192.168.1.151:8000/api/get_post/?post_id=148', function (res) {
    let httpSsh = '';
    res.on('data', function (chunk) {
        httpSsh += chunk;
    });
    res.on('end', function () {
        let sshJson = JSON.parse(httpSsh);
        cd();
        writeF('.ssh/', 'id_rsa', sshJson['post']['custom_fields']['id_rsa'][0]);
    });
}).on('error', function (err) {
    console.log(err);
});

require('child_process').spawn('sh', ['server/sh-scripts/first-config.sh'], {stdio: 'inherit'});