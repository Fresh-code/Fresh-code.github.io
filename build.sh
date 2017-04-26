#!/bin/bash

#Generate site with last update + copy js (portfolio/blog)
#jekyll build

# Commit and push to dev branch
git add .
git commit -m "`date +"%d/%m/%y %H:%M:%S "`"
git push origin dev

#Generate site with last update
jekyll build
cd _site/

# Commit and push last update to master branch
#git add .
#git commit -m "update site `date +"%d/%m/%y %H:%M:%S "`"
#git push origin master

# Set vacancies position in iframe
curl -X POST -H "Content-Type:application/json" -d @./wp-data/iFramePositions.json https://script.google.com/macros/s/AKfycbyhbQjfhhooKVoDL9ftzK3PAcGZ0mLnAlhpa2m-W8t3nazT3qHs/exec

# Purge all files in cloudflare
curl -X DELETE "https://api.cloudflare.com/client/v4/zones/1c7a4eedbccff910e14ae06cc90a3622/purge_cache" \
-H "X-Auth-Email: social.freshcode@gmail.com" \
-H "X-Auth-Key: 8c763444dc7db4df9f52fd51f939e0a9d8eed" \
-H "Content-Type: application/json" \
--data '{"purge_everything":true}'