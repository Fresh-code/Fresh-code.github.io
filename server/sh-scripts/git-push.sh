#!/bin/bash

cd /src/wp-data
git checkout master
git config user.name "Yevhenii Bilyk"
git config user.email blinkme1@ukr.net

git status
git add .
git commit -m "`date +"%d/%m/%y %H:%M:%S "`"
git push origin master