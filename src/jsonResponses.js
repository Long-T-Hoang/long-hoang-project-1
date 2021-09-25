const kits = [{ name: 'RG Nu Gundam', releaseYear: 2018 }];

// shuffle array/object
/*
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
// const getBinarySize = (string) => Buffer.byteLength(string, 'utf8');

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

  const kitToAdd = { name: uploadContent.name, releaseYear: uploadContent.releaseYear };
  kits.push(kitToAdd);

  return respond(request, response, 201, 'Created Successfully');
};

// GET code
const getKitsResponse = (request, response, params) => {
  if (kits.length === 0) {
    return respondMeta(request, response, 404);
  }

  const lookForKit = (e) => e.name === params.name || e.releaseYear === params.releaseYear;
  const content = kits.filter(lookForKit);

  return respond(request, response, 200, JSON.stringify(content));
};

const getAllKitsResponse = (request, response) => {
  if (kits.length === 0) {
    return respondMeta(request, response, 404);
  }

  const content = JSON.stringify(kits);

  return respond(request, response, 200, content);
};

module.exports = {
  getKitsResponse,
  getAllKitsResponse,
  addKit,
};
