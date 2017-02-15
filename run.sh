#!/bin/bash
node server/configureServer.js

jekyll build
jekyll serve -H 0.0.0.0 & node server/app.js