FROM blinkme1/jekyll-java-node:latest
RUN mkdir -p ~/.ssh && touch ~/.ssh/known_hosts
RUN gem install jekyll-redirect-from -v 0.10.0
ENV REBUILD_JS true
COPY . /src
WORKDIR /src/server
RUN npm install
WORKDIR /src
ENTRYPOINT ["./run.sh"]