FROM node:18.14

WORKDIR /usr/local/app

COPY package.json package-lock.json /usr/local/app/

RUN npm install && npm cache clean --force

RUN npm install -g nodemon

COPY ./ ./

CMD ["npm","run","serve"]