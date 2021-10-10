const d = new Date();

const kits = [
  {
    id: 0,
    name: 'RG Nu Gundam',
    releaseYear: 2019,
    imageURL: 'https://www.1999.co.jp/itbig60/10609842.jpg',
    msrp: 4536,
    comments:
        [
          { uploadDate: d.toDateString(), comment: 'Great kit! Would buy again 10/10' },
        ],
  },
  {
    id: 1,
    name: 'RG Sazabi',
    releaseYear: 2018,
    imageURL: 'https://www.1999.co.jp/itbig53/10538039.jpg',
    msrp: 4860,
    comments:
        [],
  },
  {
    id: 2,
    name: 'RG Full Armor Unicorn Gundam',
    releaseYear: 2018,
    imageURL: 'https://www.1999.co.jp/itbig55/10556937.jpg',
    msrp: 5832,
    comments:
        [],
  },
  {
    id: 3,
    name: 'HGUC Moon Gundam',
    releaseYear: 2018,
    imageURL: 'https://m.media-amazon.com/images/I/71Oqqgp7uTL._AC_SX679_.jpg',
    msrp: 3000,
    comments:
        [],
  },
  {
    id: 4,
    name: 'RG Crossbone Gundam X1',
    releaseYear: 2019,
    imageURL: 'https://m.media-amazon.com/images/I/61WEAQGw4XL._AC_SL1200_.jpg',
    msrp: 2700,
    comments:
        [],
  },
  {
    id: 5,
    name: 'PG RX-0 Unicorn Gundam',
    releaseYear: 2014,
    imageURL: 'https://www.hlj.com/media/catalog/product/b/a/ban994365box.jpg',
    msrp: 21600,
    comments:
        [],
  },
  {
    id: 6,
    name: 'MG Full Armor Gundam Thunderbolt Ver. KA',
    releaseYear: 2016,
    imageURL: 'https://www.1999.co.jp/itbig38/10388934.jpg',
    msrp: 7000,
    comments:
        [],
  },
  {
    id: 7,
    name: 'HG Barbatos Gundam',
    releaseYear: 2016,
    imageURL: 'https://m.media-amazon.com/images/I/81GIPYIoC0L._AC_SL1500_.jpg',
    msrp: 1100,
    comments:
        [],
  },
  {
    id: 8,
    name: 'PG Unleashed RX-78-2 Gundam',
    releaseYear: 2020,
    imageURL: 'https://i.ebayimg.com/images/g/S5cAAOSwUp1gUG98/s-l640.jpg',
    msrp: 25000,
    comments:
        [],
  },
  {
    id: 9,
    name: 'RG Hi-Nu Gundam',
    releaseYear: 2021,
    imageURL: 'https://www.1999.co.jp/itbig77/10777897.jpg',
    msrp: 4950, 
    comments:
        [],
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
  const content = { message: 'name and releaseYear are both required' };
  
  if (!uploadContent.name || !uploadContent.releaseYear) {
    return respond(request, response, 400, JSON.stringify(content));
  }

  let responseCode = 201;

  const searchKit = kits.find((e) => e.name === uploadContent.name);

  const kitToAdd = {
    id: kits.length,
    name: uploadContent.name,
    releaseYear: uploadContent.releaseYear,
    imageURL: uploadContent.imageURL,
    msrp: uploadContent.msrp,
    comments: []
  };

  if (searchKit) {
    responseCode = 204;
    const index = kits.indexOf(searchKit);
    
    kits[index] = kitToAdd;

    return respondMeta(request, response, responseCode);
  }

  kits.push(kitToAdd);
  console.log(kits);
  content.message = 'Created Successfully';
  return respond(request, response, responseCode, JSON.stringify(content));
};

const addComment = (request, response, uploadContent) => {
  if (!uploadContent.comment) {
    return respond(request, response, 200, 'Comment is required!', 'text');
  }

  if (kits[uploadContent.id]) {
    const commentObj = {
      uploadDate: uploadContent.uploadDate,
      comment: uploadContent.comment,
    };

    kits[uploadContent.id].comments.push(commentObj);
  }

  return respond(request, response, 200, 'Comment added successfully!', 'text');
};

// Get data code
const makePreviewKitObj = (obj, fullData) => {
  const target = obj;
  let content;

  if(!fullData)
  {
    content = {
      id: target.id,
      name: target.name,
      releaseYear: target.releaseYear,
    }
  }
  else{
    content = {
      id: target.id,
      name: target.name,
      releaseYear: target.releaseYear,
      msrp: target.msrp,
      imageURL: target.imageURL,
    }
  }

  return content;
};

const getKits = (params) => {
  const lookForKit = (e) => {
    let nameMatch = false;

    if (params.name) {
      nameMatch = e.name.toLowerCase().includes(params.name.toLowerCase());
    }

    const yearMatch = e.releaseYear === parseInt(params.releaseYear, 10);

    if (nameMatch || yearMatch) return true;

    return false;
  };

  const result = kits.filter(lookForKit);
  const content = [];

  content.push({ message: `${result.length} kit(s) found!` });

  for (let i = 0; i < result.length; i += 1) {
    content.push(makePreviewKitObj(result[i], false));
  }

  return content;
};

const getAllKits = () => {
  const content = [];

  for (let i = 0; i < kits.length; i += 1) {
    content.push(makePreviewKitObj(kits[i], false));
  }

  return content;
};

const getKit = (id) => makePreviewKitObj(kits[id], true);

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
    return respondMeta(request, response, 204);
  }

  const content = getKits(params);

  if (content.length === 0) {
    const statusMessage = [{ message: 'No kits found' }];
    return respond(request, response, 200, JSON.stringify(statusMessage));
  }

  if (acceptedTypes.includes('text/xml')) {
    return respond(request, response, 200, kitToXML(content), 'text/xml');
  }

  return respond(request, response, 200, JSON.stringify(content));
};

const getAllKitsResponse = (request, response, params, acceptedTypes) => {
  if (kits.length === 0) {
    return respondMeta(request, response, 204);
  }

  const content = getAllKits();

  if (acceptedTypes.includes('text/xml')) {
    return respond(request, response, 200, kitToXML(content), 'text/xml');
  }

  return respond(request, response, 200, JSON.stringify(content));
};

const getKitResponse = (request, response, params, acceptedTypes) => {
  if (kits.length === 0) {
    return respondMeta(request, response, 204);
  }

  const content = getKit(params.id);

  if (acceptedTypes.includes('text/xml')) {
    return respond(request, response, 200, kitToXML(content), 'text/xml');
  }

  return respond(request, response, 200, JSON.stringify(content));
};

const getKitCommentResponse = (request, response, params, acceptedTypes) => {
  if (kits.length === 0) {
    return respondMeta(request, response, 204);
  }

  const content = getKitComment(params.id);

  if (acceptedTypes.includes('text/xml')) {
    return respond(request, response, 200, commentToXML(content), 'text/xml');
  }
  console.log(content);
  return respond(request, response, 200, JSON.stringify(content));
};

// DELETE response code
const deleteKitResponse = (request, response, params) => {
  if (kits.length <= params.id) {
    return respondMeta(request, response, 204);
  }

  const content = { name: kits[params.id].name, message: 'Kit deleted successfully!' };

  // delete entry
  kits.splice(params.id, 1);
  console.log(content);
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
