const { check, validationResult } = require('express-validator');

const pageValidation = (req, res, next) => {
    check('title').isLength({ min: 3 }).withMessage('Title is required and minimum 3 characters long'),
    check('slug').isLength({ min: 5 }).withMessage('Page Url is required and minimum 5 characters long'),

    const errors = validationResult(req);  
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next()
};

module.exports = pageValidation;