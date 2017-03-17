#!/bin/bash

cd wp-data
git pull
cd ..

rm -rf ./img/*
rm -rf ./_data
rm -rf ./_pages

cp -rf ./proj-data/cache.yml ./_assets-cache
cp -rf ./proj-data/_data .
cp -rf ./proj-data/_pages .
cp -rf ./proj-data/images/* ./img/

cp -rf ./wp-data/img .
cp -rf ./wp-data/_data .
cp -rf ./wp-data/_pages .