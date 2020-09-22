const db = require('../models');

const Page = db.page;

exports.pages = async (req, res) => {
  const list = await Page.findAll();
  return res.status(200).send(list);
};

exports.page = async (req, res) => {
  Page.findOne({
    where: {
      slug: req.params.pageid,
    },
  })
    .then((page) => {
      if (!page) {
        return res.status(404).send({ message: 'Page Not found.' });
      }
      return res.status(200).send(page);
    });
};

exports.addPage = async (req, res) => {
  Page.create({
    title: req.body.title,
    description: req.body.description,
    slug: req.body.slug,
  })
    .then(() => {
      res.status(201).send({ message: 'Page created successfully!' });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.editPage = async (req, res) => {
  Page.findOne({
    where: {
      slug: req.body.slug,
    },
  })
    .then((page) => {
      if (!page) {
        return res.status(404).send({ message: 'Page Not found.' });
      }
      if (page) {
        Page.update({
          title: req.body.title,
          description: req.body.description,
        }, {
          where: {
            slug: req.body.slug,
          },
        })
          .then(() => {
            res.status(200).send({ message: 'Page updated successfully!' });
          })
          .catch((err) => {
            res.status(500).send({ message: err.message });
          });
      }
      return true;
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.deletePage = async (req, res) => {
  Page.destroy({
    where: {
      slug: req.params.pageid,
    },
  })
    .then((page) => {
      if (!page) {
        return res.status(404).send({ message: 'Page Not found.' });
      }
      return res.status(200).send({ message: 'Page deleted successfully!' });
    });
};
