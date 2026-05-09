const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');

const
{
   getUsers,
   updateUserRole,
   updateUserStatus,
   deleteUser,
   getMyProfile,
   updateMyProfile,
   changePassword,
   deleteMyAccount
} = require('../controllers/userController');

const
{
   updateRoleValidator,
   updateStatusValidator,
   deleteUserValidator,
   updateProfileValidator,
   changePasswordValidator
} = require('../validators/userValidator');

router.use(auth);

router.get('/', authorize('ADMIN'), getUsers);

router.put(
   '/:id/status',
   authorize('ADMIN'),
   updateStatusValidator,
   validate,
   updateUserStatus
);

router.put(
   '/:id/role',
   authorize('ADMIN'),
   updateRoleValidator,
   validate,
   updateUserRole
);

router.delete(
   '/:id',
   authorize('ADMIN'),
   deleteUserValidator,
   validate,
   deleteUser
);

router.get('/me', getMyProfile);

router.put(
   '/me',
   updateProfileValidator,
   validate,
   updateMyProfile
);

router.put(
   '/me/password',
   changePasswordValidator,
   validate,
   changePassword
);

router.delete('/me', deleteMyAccount);

module.exports = router;