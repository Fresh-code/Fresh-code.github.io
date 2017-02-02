#!/bin/bash

rm -rf ./img/*
rm -rf ./_data
rm -rf ./_pages

cp -rf ./proj-data/_data .
cp -rf ./proj-data/_pages .
cp -rf ./proj-data/images/* ./img

cp -rf ./wp-data/img .
cp -rf ./wp-data/_data .
cp -rf ./wp-data/_pages .