FROM blinkme1/jekyll-java-node:latest

ENV TZ=Europe/Kiev
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir -p ~/.ssh && touch ~/.ssh/known_hosts

RUN gem install jekyll-redirect-from
ENV LC_ALL="en_US.UTF-8"

COPY . /src
WORKDIR /src/server
RUN npm install
WORKDIR /src
ENTRYPOINT ["./run.sh"]