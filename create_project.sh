#!/bin/bash

cd wp-data
git pull
cd ..

rm -rf ./_data
rm -rf ./_pages
rm -rf ./_posts

cp -rf ./proj-data/_data .
cp -rf ./proj-data/_pages .

cp -rf ./wp-data/img .
cp -rf ./wp-data/_data .
cp -rf ./wp-data/_pages .
cp -rf ./wp-data/_posts .