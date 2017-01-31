#!/bin/bash

rm -rf ./_assets-cache
rm -rf ./img
rm -rf ./_data
rm -rf ./_pages
rm -rf ./_posts

cp -rf ./project-data/_assets-cache .
cp -rf ./project-data/_data .
cp -rf ./project-data/_pages .
cp -rf ./project-data/img .

cp -rf ./wp-data/img .
cp -rf ./wp-data/_data .
cp -rf ./wp-data/_pages .