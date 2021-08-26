const mailer = require("nodemailer");
const generatePDF =  require('./generatePDF');

let mail = '';	// <----- enter creds
let pass = '';	// <----- enter creds

let sendMail = async (data) => {
	if (mail.length < 1) {
		throw new TypeError('Provide a mailing id');
	}
	if (pass.length < 1) {
		throw new TypeError('Provide a password for the mailing id');
	}
	try {
		// let acc = await mailer.createTestAccount();
		// mail = acc.user;
		// pass = acc.pass;

		let transporter = mailer.createTransport({
			service: 'gmail',
			auth: {
				user: mail,
				pass: pass,	// https://support.google.com/accounts/answer/185833#app-passwords?p=InvalidSecondFactor
			},
		});

		let pdf = await generatePDF(data);

		let info = await transporter.sendMail({
			from: `"PDF Mailer App 🤖" <${mail}>`,
			to: data.mail,
			subject: 'PDF mailer response',
			text: 'do not reply\nplease find attachment',
			attachments: [
				{
					filename: `${new Date().getTime()}_${new Date().getDate().toLocaleString()}_${new Date().getMonth().toLocaleString()}.pdf`,
					content: pdf
				}
			]
		});

		console.log("Message sent: %s", info.messageId);
		// console.log("Preview URL: %s", mailer.getTestMessageUrl(info));

		return pdf;
	} catch (e) {
		console.error(e);
		return false;
	}
}

module.exports = sendMail;