// console.log('First web service starting up ...');

// 1 - pull in the HTTP server module
const http = require('http');

// 2 - pull in URL and query modules (for URL parsing)
const url = require('url');
const query = require('querystring');

// const path = require('path');
const htmlHandler = require('./htmlResponses');
const jsonHandler = require('./jsonResponses');
const mediaHandler = require('./mediaResponses');

// 3 - locally this will be 3000, on Heroku it will be assigned
const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET:
  {
    // get html
    '/': htmlHandler.getIndexResponse,
    '/kits': htmlHandler.getKitsResponse,
    '/upload': htmlHandler.getUploadResponse,
    '/admin': htmlHandler.getAdminResponse,
    '/kit': htmlHandler.getKitResponse,
    '/default-styles.css': htmlHandler.getCSSResponse,

    // function end points
    '/allKits': jsonHandler.getAllKitsResponse,
    '/getKits': jsonHandler.getKitsResponse,
    '/getKit': jsonHandler.getKitResponse,
    '/getKitComment': jsonHandler.getKitCommentResponse,

    // media end points
    '/logo': mediaHandler.getLogoResponse,
  },
  HEAD:
  {
    '/allKits': jsonHandler.getAllKitsHeadResponse,
    '/getKits': jsonHandler.getKitsHeadResponse,
    '/getKit': jsonHandler.getKitHeadResponse,
    '/getKitComment': jsonHandler.getKitCommentHeadResponse,
  },
  DELETE:
  {
    '/deleteKit': jsonHandler.deleteKitResponse,
  },
  notFound: htmlHandler.get404Response,
};

const handlePost = (request, response, pathname) => {
  const body = [];

  request.on('error', (error) => {
    console.dir(error);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = JSON.parse(bodyString);

    if (pathname === '/addKit') {
      jsonHandler.addKit(request, response, bodyParams);
    }
    if (pathname === '/submitComment') {
      jsonHandler.addComment(request, response, bodyParams);
    }
  });
};

const handleGetAndHead = (request, response, pathname, params, method, acceptedTypes) => {
  if (urlStruct[method][pathname]) {
    urlStruct[method][pathname](request, response, params, acceptedTypes);
  } else {
    urlStruct.notFound(request, response);
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const { pathname } = parsedUrl;
  const params = query.parse(parsedUrl.query);
  const httpMethod = request.method;

  let acceptedTypes = [];
  if (request.headers.accept) {
    acceptedTypes = request.headers.accept.split(',');
  }

  // console.log(`pathname: ${pathname}`);
  // console.log(httpMethod);

  if (httpMethod === 'POST') {
    handlePost(request, response, pathname);
  } else {
    handleGetAndHead(request, response, pathname, params, httpMethod, acceptedTypes);
  }
};

// 8 - create the server, hook up the request handling function, and start listening on `port`
http.createServer(onRequest).listen(port);

// console.log(`Listening on 127.0.0.1: ${port}`);
