#!/bin/bash
node server/configureServer.js

jekyll build
node server/app.js & jekyll serve -H 0.0.0.0