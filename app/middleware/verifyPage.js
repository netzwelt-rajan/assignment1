const db = require('../models');

const Page = db.page;

const checkDuplicatePage = (req, res, next) => {
  // page slug
  Page.findOne({
    where: {
      slug: req.body.slug,
    },
  }).then((record) => {
    if (record) {
      res.status(400).send({
        message: 'Failed! Page URL already exist!',
      });
      return;
    }

    next();
  });
};

const verifyPage = {
  checkDuplicatePage,
};

module.exports = verifyPage;
