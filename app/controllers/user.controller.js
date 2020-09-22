const bcrypt = require('bcryptjs');
const db = require('../models');

const User = db.user;

exports.allAccess = (req, res) => {
  res.status(200).send('Content');
};

exports.userBoard = (req, res) => {
  res.status(200).send({ userId: req.userId, message: 'User logged in' });
};

exports.userProfile = (req, res) => {
  User.findOne({
    where: {
      id: req.userId,
    },
  })
    .then((user) => {
      if (user) {
        User.update({
          name: req.body.name,
          age: req.body.age,
          hobbies: req.body.hobbies,
          image: req.file.filename,
        }, {
          where: {
            id: req.userId,
          },
        })
          .then(() => {
            res.status(200).send({ message: 'User profile updated successfully!' });
          })
          .catch((err) => {
            res.status(500).send({ message: err.message });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.changePassword = (req, res) => {
  if (req.body.newPassword !== req.body.newConfirmPassword) {
    return res.status(400).send({
      message: 'Password not match!',
    });
  }

  User.update({
    password: bcrypt.hashSync(req.body.newPassword, 8),
  }, {
    where: {
      id: req.userId,
    },
  })
    .then(
      () => res.status(200).send({ message: 'Password changed successfully!' }),
    )
    .catch(
      (err) => res.status(500).send({ message: err.message }),
    );
  return true;
};
