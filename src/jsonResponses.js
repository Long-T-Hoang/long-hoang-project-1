const jokes = [
  { q: 'What do you call a very small valentine?', a: 'A valen-tiny!' },
  { q: 'What did the dog say when he rubbed his tail on the sandpaper?', a: 'Ruff, Ruff!' },
  { q: "Why don't sharks like to eat clowns?", a: 'Because they taste funny!' },
  { q: 'What did the boy cat say to the girl cat?', a: "You're Purr-fect!" },
  { q: "What is a frog's favorite outdoor sport?", a: 'Fly Fishing!' },
  { q: 'I hate jokes about German sausages.', a: 'Theyre the wurst.' },
  { q: 'Did you hear about the cheese factory that exploded in France?', a: 'There was nothing left but de Brie.' },
  { q: 'Our wedding was so beautiful ', a: 'Even the cake was in tiers.' },
  { q: 'Is this pool safe for diving?', a: 'It deep ends.' },
  { q: 'Dad, can you put my shoes on?', a: 'I dont think theyll fit me.' },
  { q: 'Can February March?', a: 'No, but April May' },
  { q: 'What lies at the bottom of the ocean and twitches?', a: 'A nervous wreck.' },
  { q: 'Im reading a book on the history of glue.', a: 'I just cant seem to put it down.' },
  { q: 'Dad, can you put the cat out?', a: 'I didnt know it was on fire.' },
  { q: 'What did the ocean say to the sailboat?', a: 'Nothing, it just waved.' },
  { q: 'What do you get when you cross a snowman with a vampire?', a: 'Frostbite' },
];

// shuffle jokes array
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

// ALWAYS GIVE CREDIT - in your code comments and documentation
// Source: https://stackoverflow.com/questions/2219526/how-many-bytes-in-a-javascript-string/29955838
// Refactored to an arrow function by ACJ
const getBinarySize = (string) => Buffer.byteLength(string, 'utf8');

// get one joke
const getRandomJoke = (joke) => JSON.stringify(joke);

const getRandomJokeXML = (joke) => {
  const xmlResponse = `<joke>
    <q>${joke.q}</q>
    <a>${joke.a}</a>
  </joke>`;

  return xmlResponse;
};

// get multiple jokes
const getMultiRandomJokes = (limit = 1) => {
  let jokeLimit = parseInt(limit, 10);

  if (jokeLimit < 1) jokeLimit = 1;
  else if (jokeLimit > jokes.length) jokeLimit = jokes.length;
  jokeLimit = Math.floor(jokeLimit);

  const jokesResponse = shuffle(jokes).slice(0, limit);
  return jokesResponse;
};

const getMultiRandomJokesJSON = (jokeList) => JSON.stringify(jokeList);

const getMultiRandomJokesXML = (jokeList) => {
  let xmlResponse = '<jokes>';

  for (let i = 0; i < jokeList.length; i += 1) {
    xmlResponse
    += `<joke>
    <q>${jokeList[i].q}</q>
    <a>${jokeList[i].a}</a>
    </joke>`;
  }

  xmlResponse += '</jokes>';

  return xmlResponse;
};

// responses
const respond = (request, response, content, type, httpMethod) => {
  if (httpMethod !== 'HEAD') {
    response.writeHead(200, { 'Content-Type': type });
    response.write(content);
    response.end();
  } else {
    const contentLength = getBinarySize(content);

    response.writeHead(200, { 'Content-Type': type, 'Content-Length': contentLength });
    response.end();
  }
};

const getMultiRandomJokeResponse = (request, response, acceptedTypes, params, httpMethod) => {
  // pick out one joke
  const jokeList = getMultiRandomJokes(params.limit);

  // write response based on accept header
  if (acceptedTypes.includes('text/xml')) {
    return respond(request, response, getMultiRandomJokesXML(jokeList), 'text/xml', httpMethod);
  }

  return respond(request, response, getMultiRandomJokesJSON(jokeList), 'application/json', httpMethod);
};

const getRandomJokeResponse = (request, response, acceptedTypes, params, httpMethod) => {
  // pick out one joke
  const number = Math.floor(Math.random() * jokes.length);
  const joke = jokes[number];

  // write response based on accept header
  if (acceptedTypes.includes('text/xml')) {
    return respond(request, response, getRandomJokeXML(joke), 'text/xml', httpMethod);
  }

  return respond(request, response, getRandomJoke(joke), 'application/json', httpMethod);
};

module.exports = {
  getRandomJokeResponse,
  getMultiRandomJokeResponse,
};
