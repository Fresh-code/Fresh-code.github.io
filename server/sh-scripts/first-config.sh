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

# delete css cache
sed --in-place '/css\/main.css/d' ./_assets-cache/cache.yml