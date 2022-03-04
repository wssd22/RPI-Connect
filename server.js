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

app.get('/login', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '/public/login.html'));
})

app.get('/register', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '/public/register.html'));
})

app.get('/myRequests', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '/public/myRequests.html'));
})

app.get('/profile', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '/public/Profile.html'));
})

app.get('/userInfo', (req, res) => {
  res.json(
    {
      "firstName": "Emma",
      "lastName": "Skantze",
      "email": "skante@rpi.edu",
      "gradYear": "2022",
      "discord": "emmaskantze",
      "past": [
        {"major":"BIOL", "code":"1010", "class": "Introduction To Biology"},
        {"major":"BIOL", "code":"1015", "class": "Introduction To Biology Lab"},
        {"major":"CSCI", "code":"1100", "class": "Computer Science I"},
        {"major":"MATH", "code":"1010", "class": "Calculus I"}
      ],
      "current": [
        {"major":"COMM", "code":"2520", "class": "Communication Theory & Prac."},
        {"major":"CSCI", "code":"1200", "class": "Data Structures"},
        {"major":"MATH", "code":"1020", "class": "Calculus II"},
        {"major":"PSYC", "code":"2370", "class": "Social Psychology"}
      ]
    }
  )
})

app.get('/userRequests', (req, res) => {
  res.json(
    {
      "current": [
        {
          "major": "CSCI",
          "code": "1200",
          "class": "Data Structures",
          "message": "Should I drop this class? It seems like too much work.",
          "created": "2/22/2022",
          "daysLeft": "3",
          "status": "active"
        },
        {
          "major": "PSYC",
          "code": "2520",
          "class": "Social Psychology",
          "message": "What are the social aspects of psychology?",
          "created": "3/5/2022",
          "daysLeft": "14",
          "status": "active"
        }
      ],
      "past": [
        {
          "major": "BIOL",
          "code": "1010",
          "class": "Introduction to Biology",
          "message": "What are the functions of mitochondria?",
          "created": "1/1/2022",
          "daysLeft": "0",
          "status": "killed"
        }
      ],
    }
  )
})

app.get('/requestsInfo', (req, res) => {
  res.json(
    {
      "userclasses": {
        "BIOL 1010 Introduction to Biology":"Fall 2021",
        "BIOL 1015 Introduction to Biology Lab":"Fall 2021",
        "COMM 2520 Communication Theory & Prac.":"Spring 2022",
        "CSCI 1100 Computer Science I":"Fall 2021",
        "CSCI 1200 Data Structures":"Spring 2022",
        "MATH 1010 Calculus I":"Fall 2021",
        "MATH 1020 Calculus II":"Spring 2022",
        "PSYC 1200 Social Psychology": "Spring 2022"
      },
      "requests" : [[
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
    //res.sendFile(path.join(__dirname, '/public/Navbar.html'))
})



app.listen(port, () => {
	console.log('Listening on *:3000')
})