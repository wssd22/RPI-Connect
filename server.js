var http = require('http');
http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello world\n');
}).listen(3000, '127.0.0.1');
console.log('Server running at 127.0.0.1:3000');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// to server CSS, frontend javascript, images, etc.
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '/public/index.html'));
})

app.get('/requests', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '/public/Requests.html'));
})

app.get('/requestsInfo', (req, res) => {
  res.json(
    {
      "data" : [[
        {
          "major":"CSCI"
        },
        {
          "class":"CSCI 1200 Data Structures",
          "days":"3",
          "question":"What's an array?",
          "discord": "@emmaskantze"
        },
        {
          "class":"CSCI 1100 Computer Science 1",
          "days":"3",
          "question":"Yo what's a string mean again?",
          "discord": "@emmaskantze"
        }],
        [{
          "major":"PSYC"
        },
        {
        "class":"PSYC 1100 General Psychology",
        "days":"8",
        "question":"Why is psych important?",
        "discord": "@emmaskantze"
        },
        {
        "class":"PSYC 1200 Social Psychology",
        "days":"5",
        "question":"What's the Prof's email?",
        "discord": "@emmaskantze"
        }]]
    }
  )
})

app.listen(port, () => {
	console.log('Listening on *:3000')
})