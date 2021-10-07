const d = new Date();

const kits = [
  {
    id: 0,
    name: 'RG Nu Gundam',
    releaseYear: 2018,
    imageURL: 'https://www.1999.co.jp/itbig60/10609842.jpg',
    comments:
        [
          { uploadDate: d.toDateString(), comment: 'Great kit! Would buy again 10/10' },
        ],
  },
];

/*
shuffle array/object

const shuffle = (array) => {
  const shuffledArray = array;

  for (let i = 0; i < shuffledArray.length; i += 1) {
    const alt = shuffledArray[i];
    const rand = Math.floor(Math.random() * jokes.length);

    shuffledArray[i] = shuffledArray[rand];
    shuffledArray[rand] = alt;
  }

  return shuffledArray;
};
*/

// ALWAYS GIVE CREDIT - in your code comments and documentation
// Source: https://stackoverflow.com/questions/2219526/how-many-bytes-in-a-javascript-string/29955838
// Refactored to an arrow function by ACJ
const getBinarySize = (string) => Buffer.byteLength(string, 'utf8');

// responses
const respond = (request, response, status, content, type = 'application/json') => {
  response.writeHead(status, { 'Content-Type': type });
  response.write(content);
  response.end();
};

const respondMeta = (request, response, status, type = 'application/json') => {
  response.writeHead(status, { 'Content-Type': type });
  response.end();
};

const headRespond = (request, response, status, content, type = 'application/json') => {
  const contentLength = getBinarySize(content);

  response.writeHead(status, { 'Content-Type': type, 'Content-Length': contentLength });
  response.end();
};

// POST code
const addKit = (request, response, uploadContent) => {
  if (!uploadContent.name || !uploadContent.releaseYear) {
    return respond(request, response, 400, 'name and releaseYear are both required', 'application/json');
  }

  let responseCode = 201;

  const searchKit = kits.find((e) => e.name === uploadContent.name);

  if (searchKit) {
    responseCode = 204;
    const index = kits.indexOf(searchKit);
    kits[index].name = uploadContent.name;
    kits[index].releaseYear = uploadContent.releaseYear;

    return respondMeta(request, response, responseCode);
  }

  // create object to add to aray
  const kitToAdd = {
    id: kits.length,
    name: uploadContent.name,
    releaseYear: uploadContent.releaseYear,
    imageURL: uploadContent.imageURL,
  };
  kits.push(kitToAdd);

  return respond(request, response, responseCode, 'Created Successfully');
};

const addComment = (request, response, uploadContent) => {
  if (!uploadContent.comment) {
    return respond(request, response, 400, 'comment is required', 'application/json');
  }

  const responseCode = 204;

  if (kits[uploadContent.id]) {
    const commentObj = {
      uploadDate: uploadContent.uploadDate,
      comment: uploadContent.comment,
    };

    kits[uploadContent.id].comments.push(commentObj);
  }

  return respond(request, response, responseCode, 'Comment Added Successfully');
};

// Get data code
const makePreviewKitObj = (obj) => {
  const target = obj;

  const content = {
    id: target.id,
    name: target.name,
    releaseYear: target.releaseYear,
    imageURL: target.imageURL,
  };

  return content;
};

const getKits = (params) => {
  const lookForKit = (e) => {
    let nameMatch = false;

    if (params.name) {
      nameMatch = e.name.toLowerCase().includes(params.name.toLowerCase());
    }

    const yearMatch = e.releaseYear === params.releaseYear;

    if (nameMatch || yearMatch) return true;

    return false;
  };

  const result = kits.filter(lookForKit);
  const content = [];

  for (let i = 0; i < result.length; i += 1) {
    content.push(makePreviewKitObj(result[i]));
  }

  return content;
};

const getAllKits = () => {
  const content = [];

  for (let i = 0; i < kits.length; i += 1) {
    content.push(makePreviewKitObj(kits[i]));
  }

  return content;
};

const getKit = (id) => makePreviewKitObj(kits[id]);

const getKitComment = (id) => kits[id].comments;

const kitToXML = (content) => {
  if (Array.isArray(content)) {
    let xmlResponse = '<kits>';

    for (let i = 0; i < content.length; i += 1) {
      xmlResponse
      += `<kit>
      <id>${content[i].id}</id>
      <name>${content[i].name}</name>
      <release-year>${content[i].releaseYear}</release-year>
      <image-url>${content[i].imageURL}</image-url>
      </kit>`;
    }

    xmlResponse += '</jokes>';

    return xmlResponse;
  }

  const xmlResponse = `<kit>
      <id>${content.id}</id>
      <name>${content.name}</name>
      <release-year>${content.releaseYear}</release-year>
      <image-url>${content.imageURL}</image-url>
      </kit>`;

  return xmlResponse;
};

const commentToXML = (content) => {
  let xmlResponse = '<comments>';

  for (let i = 0; i < content.length; i += 1) {
    xmlResponse += `<comment>
    <upload-date>${content[i].uploadDate}</upload-date>
    <comment-text>${content[i].comment}</comment-text>
    </comment>`;
  }

  xmlResponse += '</comments>';

  return xmlResponse;
};

// GET response  code
const getKitsResponse = (request, response, params, acceptedTypes) => {
  if (kits.length === 0) {
    return respondMeta(request, response, 404);
  }

  const content = getKits(params);

  if (content.length === 0) {
    return respondMeta(request, response, 204);
  }

  if (acceptedTypes.includes('text/xml')) {
    return respond(request, response, 200, kitToXML(content), 'text/xml');
  }

  return respond(request, response, 200, JSON.stringify(content));
};

const getAllKitsResponse = (request, response, params, acceptedTypes) => {
  if (kits.length === 0) {
    return respondMeta(request, response, 404);
  }

  const content = getAllKits();

  if (acceptedTypes.includes('text/xml')) {
    return respond(request, response, 200, kitToXML(content), 'text/xml');
  }

  return respond(request, response, 200, JSON.stringify(content));
};

const getKitResponse = (request, response, params, acceptedTypes) => {
  if (kits.length === 0) {
    return respondMeta(request, response, 404);
  }

  const content = getKit(params.id);

  if (acceptedTypes.includes('text/xml')) {
    return respond(request, response, 200, kitToXML(content), 'text/xml');
  }

  return respond(request, response, 200, JSON.stringify(content));
};

const deleteKitResponse = (request, response, params) => {
  if (kits.length <= params.id) {
    return respondMeta(request, response, 404);
  }

  const content = { name: kits[params.id].name, message: 'Kit deleted successfully!' };

  // delete entry
  kits.splice(params.id, 1);
  console.log(content);
  return respond(request, response, 200, JSON.stringify(content));
};

const getKitCommentResponse = (request, response, params, acceptedTypes) => {
  if (kits.length === 0) {
    return respondMeta(request, response, 404);
  }

  const content = getKitComment(params.id);

  if (acceptedTypes.includes('text/xml')) {
    return respond(request, response, 200, commentToXML(content), 'text/xml');
  }

  return respond(request, response, 200, JSON.stringify(content));
};

// HEAD response code
const getKitsHeadResponse = (request, response, params, acceptedTypes) => {
  const content = getKits(params);

  if (acceptedTypes.includes('text/xml')) {
    return headRespond(request, response, 200, kitToXML(content), 'text/xml');
  }

  return headRespond(request, response, 200, JSON.stringify(content));
};

const getAllKitsHeadResponse = (request, response, params, acceptedTypes) => {
  const content = getAllKits();

  if (acceptedTypes.includes('text/xml')) {
    return headRespond(request, response, 200, kitToXML(content), 'text/xml');
  }

  return headRespond(request, response, 200, JSON.stringify(content));
};

const getKitHeadResponse = (request, response, params, acceptedTypes) => {
  const content = getKit(params.id);

  if (acceptedTypes.includes('text/xml')) {
    return headRespond(request, response, 200, kitToXML(content), 'text/xml');
  }

  return headRespond(request, response, 200, JSON.stringify(content));
};

const getKitCommentHeadResponse = (request, response, params, acceptedTypes) => {
  const content = getKitComment(params.id);

  if (acceptedTypes.includes('text/xml')) {
    return headRespond(request, response, 200, commentToXML(content), 'text/xml');
  }

  return headRespond(request, response, 200, JSON.stringify(content));
};

module.exports = {
  // GET response
  getKitsResponse,
  getAllKitsResponse,
  getKitResponse,
  deleteKitResponse,
  getKitCommentResponse,

  // POST response
  addKit,
  addComment,

  // HEAD response
  getKitsHeadResponse,
  getAllKitsHeadResponse,
  getKitHeadResponse,
  getKitCommentHeadResponse,
};
