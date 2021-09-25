const fs = require('fs');

const errorPage = fs.readFileSync(`${__dirname}/../client/error.html`);
const defaultCSS = fs.readFileSync(`${__dirname}/../css/default-styles.css`);
const jokeClient = fs.readFileSync(`${__dirname}/../client/joke-client.html`);

const get404Response = (request, response) => {
  response.writeHead(404, { 'Content-Type': 'text/html' });
  response.write(errorPage);
  response.end();
};

const getCSSResponse = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(defaultCSS);
  response.end();
};

const getJokeClient = (request, response) => {
  response.writeHead(404, { 'Content-Type': 'text/html' });
  response.write(jokeClient);
  response.end();
};

module.exports = {
  get404Response,
  getCSSResponse,
  getJokeClient,
};
