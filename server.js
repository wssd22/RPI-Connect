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
    res.send("hello world")
})

app.listen(port, () => {
	console.log('Listening on *:3000')
})