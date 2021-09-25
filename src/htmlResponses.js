const fs = require('fs');

const errorPage = fs.readFileSync(`${__dirname}/../client/error.html`);
const indexPage = fs.readFileSync(`${__dirname}/../client/index.html`);
const kitsPage = fs.readFileSync(`${__dirname}/../client/kits.html`);
const uploadPage = fs.readFileSync(`${__dirname}/../client/upload.html`);
const adminPage = fs.readFileSync(`${__dirname}/../client/admin.html`);
const defaultCSS = fs.readFileSync(`${__dirname}/../css/default-styles.css`);

const get404Response = (request, response) => {
  response.writeHead(404, { 'Content-Type': 'text/html' });
  response.write(errorPage);
  response.end();
};

const getIndexResponse = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(indexPage);
  response.end();
};

const getKitsResponse = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(kitsPage);
  response.end();
};

const getUploadResponse = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(uploadPage);
  response.end();
};

const getAdminResponse = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(adminPage);
  response.end();
};

const getCSSResponse = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(defaultCSS);
  response.end();
};

module.exports = {
  get404Response,
  getIndexResponse,
  getKitsResponse,
  getUploadResponse,
  getAdminResponse,
  getCSSResponse,
};
