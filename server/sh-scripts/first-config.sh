#!/bin/bash

# adding ssh key
eval $(ssh-agent -s)
ssh-keyscan -t rsa gitlab.com >> ~/.ssh/known_hosts
chmod 400 ~/.ssh/id_rsa
ssh-add ~/.ssh/id_rsa

# git configuration
cd wp-data
git config user.name "Yevhenii Bilyk"
git config user.email blinkme1@ukr.net
git checkout master
cd ..

# submodule update
git submodule init
git submodule update

# copying data
rm -rf ./img/*
rm -rf ./_data
rm -rf ./_pages
rm -rf ./_posts

mkdir -p img

cp -rf ./proj-data/cache.yml ./_assets-cache
cp -rf ./proj-data/_data .
cp -rf ./proj-data/_pages .
cp -rf ./proj-data/images/* ./img/

cp -rf ./wp-data/_posts .
cp -rf ./wp-data/img .
cp -rf ./wp-data/_data .
cp -rf ./wp-data/_pages .