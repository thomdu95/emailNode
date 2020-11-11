const express = require("express");
const cors = require("cors");
const nodeMailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport")
const api = express();
const helmet = require("helmet");


require("dotenv").config();

api.use(cors());
api.use(express.urlencoded({ extended: true }));
api.use(express.json());
api.use(helmet())

api.post("/sendEmail", (req, res) => {
  try {
    if (!req.body.name) throw "NO NAME PROVIDED";
    if (!req.body.email) throw "NO EMAIL PROVIDED";
    if (!req.body.message) throw "NO MESSAGE PROVIDED";
    const mailTransporter = nodeMailer.createTransport(
      sgTransport({
        auth: {
          api_key: process.env.ADMIN_EMAIL_API_KEY, // your api key here, better hide it in env vars
        },
      })
    );
    // let transporter = nodeMailer.createTransport({
    //   host: "smtp.gmail.com",
    //   service: "gmail",
    //   port: 465,
    //   secure: true,
    //   auth: {
    //     // should be replaced with real sender's account
    //     user: "thomas.jamais95@gmail.com",
    //     pass: process.env.PASS,
    //   },
    // });
    let mailSendFirstOptions = {
      from: `thomas.jamais95@gmail.com`,
      to: "thomas.jamais95@gmail.com",
      subject: "Thomas, " + req.body.name + " t'a envoyé un email",
      html: `${req.body.email}\nVia ton site, ${req.body.name} vient de t'envoyer un email :\n${req.body.message}`,
    };
    // transporter.sendMail(mailSendFirstOptions, (error, info) => {
    mailTransporter.sendMail(mailSendFirstOptions, (error, info) => {
      if (error) {
        throw error;
      }
      let mailOptions = {
        // should be replaced with real recipient's account
        from: `thomas.jamais95@gmail.com`,
        to: req.body.email,
        subject:
          "Votre Email a bien été transmit, je reviens vers vous dès que possible.",
        html: `<p>Bonjour ${req.body.name} !</p><p>J\'ai bien reçu votre email et je vous répondrais dès que j\'en aurais pris connaissance.</p><p>Je vous remercie de votre email et vous souhaite une agréable journée !</p><p>PS : Il est inutile de répondre à cet email puisque c\'est un email automatique ! </p><img src="https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif" width="480" height="240"/>`,
      };
      // transporter.sendMail(mailOptions, (error, info) => {
      mailTransporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          throw error;
        }
        res.status(200).send("success");
      });
    });


  } catch (error) {
    res.status(203).send(`ERROR : ${error}`);
  }
});
// api.use(express.bodyParser())

api.listen(process.env.PORT || 8080, () => {
  console.log("Connected on http://localhost:8080/");
});
