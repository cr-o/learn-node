const nodemailer = require('nodemailer'); // nodemailer will interface with SMTP and a number of transports
const pug = require('pug');
const juice = require('juice'); // give it html with style tags and it will inline the style
const htmlToTExt = require('html-to-text');
const promisify = require('es6-promisify');

// we must create a transport, or a way of interfacing with ways of sending email

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    }
});

// pug template file is given the resetURL which has the token
const generateHTML = (filename, options={}) => { // arrow function that takes in file name and options
    const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options); // use pug library's renderFile method to take a name of an actual file to search for. __dirname is a variable available in every folder. it is the current directory that we are running this file from.
    const inlined = juice(html);
    return inlined;
} // this is not needed outside this file so there is no need to export it

exports.send = async (options) => {
    const html = generateHTML(options.filename, options);
    const text = htmlToTExt.fromString(html);
    const mailOptions = {
        from: 'Work Zoop <workemailzoop@gmail.com>',
        to: options.user.email,
        subject: options.subject,
        html,
        text
    };
    const sendMail = promisify(transport.sendMail, transport);
    return sendMail(mailOptions);
}