FROM blinkme1/jekyll-java-node:latest

RUN mkdir -p ~/.ssh && touch ~/.ssh/known_hosts
COPY . /src
WORKDIR /src/server
RUN npm install
WORKDIR /src
ENTRYPOINT ["./run.sh"]