#!/bin/bash
node server/get-ssh.js

git config user.name "Yevhenii Bilyk"
git config user.email blinkme1@ukr.net

eval $(ssh-agent -s)
ssh-keyscan -t rsa gitlab.com >> ~/.ssh/known_hosts
chmod 400 ~/.ssh/id_rsa
ssh-add ~/.ssh/id_rsa

cd wp-data
git checkout master
cd ..

cd project-data
git checkout master
cd ..

git submodule init
git submodule update

sh ./create_project.sh

jekyll build

jekyll serve -H 0.0.0.0 & node server/app.js