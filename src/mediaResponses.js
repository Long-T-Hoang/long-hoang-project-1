const fs = require('fs');

const logo = fs.readFileSync(`${__dirname}/../media/test-logo-small.png`);

const getLogoResponse = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'image/png' });
  response.write(logo);
  response.end();
};

module.exports = {
  getLogoResponse,
};
