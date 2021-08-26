const express = require('express');
const socketio = require('socket.io');
const sendMail = require('./mail.js')

const app = express();
let webserver = app.listen(8080, () => {
	console.log('app is running');
});
const io = new socketio.Server(webserver);

const generatePDF = require('./generatePDF');

app.use(express.static(__dirname + '/static'));

let temp;

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});
app.get('/pdf', async (req, res) => {
	res.send(await generatePDF(temp));
});

io.on('connection', socket => {
	socket.on('disconnect', () => {
		console.log(socket.id + ' disconnected')
	})
	console.log(socket.id, 'joined');

	socket.on('dataTransport', async data => {
		let result = await sendMail(data);
		if (!result) {
			socket.emit('badMail');
		} else {
			temp = result;
			socket.emit('success');
		}
	})
});