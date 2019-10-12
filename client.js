const express = require('express');

const app = express();

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/public/index.html');
});

app.listen(7000);
