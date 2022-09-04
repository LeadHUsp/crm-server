RUN sudo curl -fsSL https://deb.nodesource.com/setup_12.x | sudo bash -
RUN sudo apt-get install -y nodejs

FROM node:12.18.1
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD ['npm', 'start']