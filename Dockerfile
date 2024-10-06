FROM node:latest


WORKDIR /myapp
COPY package.json /myapp
RUN npm install

COPY . .

CMD npm start