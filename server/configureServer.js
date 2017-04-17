'use strict';

require('shelljs/global');
const http = require('http');
const fs = require('fs');
const childProcess = require('child_process');

const colorGreen = '\x1b[32m';
const colorYellow = '\x1b[33m';
const colorRed = '\x1b[31m';


const configServer = (function() {
    let tryNumber = 0;
    return function () {
        if(tryNumber === 0) {
            getSshFromWp();
        }
        else if( tryNumber > 0 && tryNumber <= 0 ){
            console.log(colorRed, 'Trying again... (' + tryNumber + ')\n');
            getSshFromWp();
        }
        else if(tryNumber > 2) {
            console.log(colorRed, 'Something is wrong');
        }
        tryNumber++;
    }
}());

function getSshFromWp() {
    console.log(colorYellow, 'Getting SSH key...');
    http.get('http://192.168.1.151:8000/api/get_post/?post_id=148', function (res) {
        let httpSsh = '';
        res.on('data', function (chunk) {
            httpSsh += chunk;
        });
        res.on('end', function () {
            let sshJson = JSON.parse(httpSsh);

            if (sshJson.length != 0) {
                console.log(colorGreen, 'Key was successfully uploaded from WP.');
                writeF(sshJson['post']['custom_fields']['id_rsa'][0]);
            } else {
                console.log(colorRed, 'Key is not loaded.');
                configServer();
            }
        });
    }).on('error', function (err) {
        console.log(err);
    });
}

const writeF = function (data) {
    const filePath = '.ssh/id_rsa';
    console.log(colorYellow, 'Writing SSH key in file...');

    cd();
    fs.writeFileSync('.ssh/id_rsa', data);

    if (fs.existsSync(filePath)) {
        console.log(colorGreen, 'Key was successfully written in file.');
        runProjectConfig();
    } else {
        console.log(colorRed, 'Key is not written in file.');
        configServer();
    }
};

function runProjectConfig() {
    console.log(colorYellow, 'Configure project... (run first-config.sh)');
    cd('/src/');
    childProcess.spawn('sh', ['server/sh-scripts/first-config.sh'], {stdio: 'inherit'});
}

configServer();