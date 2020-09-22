module.exports = (sequelize, Sequelize) => {
  const Page = sequelize.define('pages', {
    title: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: Sequelize.TEXT,
      validate: {
        notEmpty: true,
      },
    },
    slug: {
      type: Sequelize.STRING(50),
      validate: {
        notEmpty: true,
      },
    },
  });

  return Page;
};
