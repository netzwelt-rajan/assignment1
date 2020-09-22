const { authJwt, verifyPage } = require('../middleware');
// const { validatePage } = require('../validations');
const controller = require('../controllers/page.controller');

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept',
    );
    next();
  });

  app.get('/api/pages', [authJwt.verifyToken], controller.pages);

  app.get(
    '/api/page/:pageid',
    [authJwt.verifyToken],
    controller.page,
  );

  app.post(
    '/api/page',
    [
      authJwt.verifyToken,
      verifyPage.checkDuplicatePage,
    ],
    controller.addPage,
  );

  app.put(
    '/api/page',
    [authJwt.verifyToken],
    controller.editPage,
  );

  app.delete(
    '/api/page/:pageid',
    [authJwt.verifyToken],
    controller.deletePage,
  );
};
