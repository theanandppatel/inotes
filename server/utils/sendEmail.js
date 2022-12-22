// const nodemailer = require("nodemailer");
// //​Credentials
// //​Mailing Function​
// export const sendEmail = async (email, subject, msg) => {

// 	//​Create transport + auth​
// 	let transporter = nodemailer.createTransport({
// 		host: "​smtp.gmail.com​",
// 		port: 587,
// 		secure:false,
// 		auth: {
// 			user: "inotes111@gmail.com",
// 			pass: "knxtnhgcozzapivm​"
// 		}
// 	});

// 	//​Create the message object​
// 	let message = {
// 		from: '​inotes111@gmail.com',
// 		to: email,
// 		subject: subject,
// 		text: msg
// 		//​ html: "<p>HTML version of the message</p>"​
// 	};

// 	//​Send mail​
// 	transporter.sendMail(message)
// }