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

git submodule init
git submodule update


rm -rf ./img/*
rm -rf ./_data
rm -rf ./_pages

cp -rf ./proj-data/cache.yml ./_assets-cache
cp -rf ./proj-data/_data .
cp -rf ./proj-data/_pages .
cp -rf ./proj-data/images/* ./img

cp -rf ./wp-data/_posts .
cp -rf ./wp-data/img .
cp -rf ./wp-data/_data .
cp -rf ./wp-data/_pages .


jekyll build
jekyll serve -H 0.0.0.0 & node server/app.js