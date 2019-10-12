const express = require('express');

const app = express();

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/public/index.html');
});

app.get('/app.js', (request, response) => {
  response.sendFile(__dirname + '/public/app.js');
});

app.listen(7000);
