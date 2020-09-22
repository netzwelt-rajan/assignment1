const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodeMailer = require('nodemailer');
const db = require('../models');
const config = require('../config/auth.config');

const User = db.user;

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then(() => {
      res.status(201).send({ message: 'User registered successfully!' });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password,
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid Password!',
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: '1d', // 24 hours
      });

      return res.status(200).send({
        id: user.id,
        name: user.name,
        email: user.email,
        accessToken: token,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signout = (req, res) => {
  res.status(200).send({
    accessToken: null,
    message: 'User Logout!',
  });
};

exports.forgotPassword = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }

      const newPassword = 'user1234';
      User.update({ password: bcrypt.hashSync(newPassword, 8) }, {
        where: {
          email: req.body.email,
        },
      });

      // send email
      const transport = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailBody = `Dear ${user.name}!,<br><br>Your new password is <b>${newPassword}</b><br><br>Regards`;
      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: req.body.email,
        subject: 'Forgot Password - DeApp',
        html: mailBody,
      };

      transport.sendMail(mailOptions, (error) => {
        if (error) {
          return res.status(500).send({ message: error });
        }
        return res.status(200).send({ message: 'Password sent on your registered email address.' });
      });
      return true;
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
