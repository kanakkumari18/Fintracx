const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');

const
{
   createRecord,
   getRecords,
   updateRecord,
   deleteRecord
} = require('../controllers/recordController');

const
{
   createRecordValidator,
   updateRecordValidator,
   deleteRecordValidator
} = require('../validators/recordValidator');

router.use(auth);

router.get(
   '/',
   authorize('VIEWER', 'ANALYST', 'ADMIN'),
   getRecords
);

router.post(
   '/',
   authorize('ANALYST', 'ADMIN'),
   createRecordValidator,
   validate,
   createRecord
);

router.put(
   '/:id',
   authorize('ANALYST', 'ADMIN'),
   updateRecordValidator,
   validate,
   updateRecord
);

router.delete(
   '/:id',
   authorize('ANALYST', 'ADMIN'),
   deleteRecordValidator,
   validate,
   deleteRecord
);

module.exports = router;