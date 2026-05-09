const { body, param } = require('express-validator');

exports.updateRoleValidator = [
   param('id')
      .isMongoId()
      .withMessage('Invalid user ID'),

   body('role')
      .isIn(['VIEWER', 'ANALYST', 'ADMIN'])
      .withMessage('Invalid role')
];

exports.updateStatusValidator = [
   param('id')
      .isMongoId()
      .withMessage('Invalid user ID'),

   body('isActive')
      .isBoolean()
      .withMessage('isActive must be true or false')
];

exports.deleteUserValidator = [
   param('id')
      .isMongoId()
      .withMessage('Invalid user ID')
];

exports.updateProfileValidator = [
   body('name')
      .optional()
      .notEmpty()
      .withMessage('Name cannot be empty'),

   body('email')
      .optional()
      .isEmail()
      .withMessage('Valid email required')
];

exports.changePasswordValidator = [
   body('currentPassword')
      .notEmpty()
      .withMessage('Current password required'),

   body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters')
];