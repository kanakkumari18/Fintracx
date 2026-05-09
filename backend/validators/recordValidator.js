const { body, param } = require('express-validator');

exports.createRecordValidator = [
   body('amount')
      .isFloat({ gt: 0 })
      .withMessage('Amount must be greater than 0'),

   body('type')
      .isIn(['income', 'expense'])
      .withMessage('Invalid type'),

   body('category')
      .notEmpty()
      .withMessage('Category is required'),

   body('date')
      .optional()
      .isISO8601()
      .withMessage('Invalid date')
];

exports.updateRecordValidator = [
   param('id')
      .isMongoId()
      .withMessage('Invalid record ID'),

   body('amount')
      .optional()
      .isFloat({ gt: 0 })
      .withMessage('Amount must be greater than 0'),

   body('type')
      .optional()
      .isIn(['income', 'expense'])
      .withMessage('Invalid type'),

   body('category')
      .optional()
      .notEmpty()
      .withMessage('Category cannot be empty'),

   body('date')
      .optional()
      .isISO8601()
      .withMessage('Invalid date')
];

exports.deleteRecordValidator = [
   param('id')
      .isMongoId()
      .withMessage('Invalid record ID')
];