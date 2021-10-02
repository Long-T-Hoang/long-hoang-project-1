const kits = [
  {
    id: 0, name: 'RG Nu Gundam', releaseYear: 2018, imageURL: 'https://www.1999.co.jp/itbig60/10609842.jpg',
      comments: 
        [
          {comment: "Great kit! Would buy again 10/10"}
        ]
  }
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

  return respond(request, response, 201, 'Created Successfully');
};

// GET code

const makePreviewKitObj = (obj) => {
  const target = obj;
  console.log(target);
  const content = {
    id: target.id, 
    name: target.name, 
    releaseYear: target.releaseYear, 
    imageURL: target.imageURL
  };

  return content;
}

const getKitsResponse = (request, response, params) => {
  if (kits.length === 0) {
    return respondMeta(request, response, 404);
  }

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

  for(let i = 0; i < result.length; i += 1)
  {
    content.push(makePreviewKitObj(result[i]));
  }

  if(content.length === 0)
  {
    return respondMeta(request, response, 204);
  }

  return respond(request, response, 200, JSON.stringify(content));
};

const getAllKitsResponse = (request, response) => {
  if (kits.length === 0) {
    return respondMeta(request, response, 404);
  }

  const content = [];

  for(let i = 0; i < kits.length; i += 1)
  {
    content.push(makePreviewKitObj(kits[i]));
  }

  return respond(request, response, 200, JSON.stringify(content));
};

const getKitResponse = (request, response, params) => {
  if (kits.length === 0) {
    return respondMeta(request, response, 404);
  }

  const content = makePreviewKitObj(kits[params.id]);

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

const getKitCommentResponse = (request, response, params) => {
  if (kits.length === 0) {
    return respondMeta(request, response, 404);
  }
  
  const content = kits[params.id].comments;

  return respond(request, response, 200, JSON.stringify(content));
};

module.exports = {
  getKitsResponse,
  getAllKitsResponse,
  getKitResponse,
  addKit,
  deleteKitResponse,
  getKitCommentResponse,
};
