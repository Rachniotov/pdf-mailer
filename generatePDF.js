const pdfkit = require('pdfkit');

const generate = (data) => {
	console.log(data)
	const doc = new pdfkit({bufferPages: true, size: 'A4'});

	let buffer = [];
	let promise = new Promise((res, rej) => {
		doc.on('data', buffer.push.bind(buffer));
		doc.on('end', () => {
			let pdfBuffer = Buffer.concat(buffer);
			res(pdfBuffer);
		});
	});


	let placer = 20;
	let inc = 12;
	for (let i = 0; i < parseInt(data.number); i++) {
		doc.fontSize(10);
		let height = doc.heightOfString(`${data.name}\n${data.mail}\n${data.address}\n${data.phone}`);
		let width = doc.widthOfString(`${data.name}\n${data.mail}\n${data.address}\n${data.phone}`);

		if (placer > 840 - (height + 64)) {
			doc.addPage();
			placer = 20;
		}

		doc.text(`${data.name}\n${data.mail}\n${data.address}\n${data.phone}`, 30, placer);
		placer += height + 20;

		doc.moveTo(10, placer);
		doc.lineTo(width, placer);
		placer = placer + 20;
		doc.stroke()
	}

	doc.end();
	return promise
}

module.exports = generate;