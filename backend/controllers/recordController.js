const Record = require('../models/Record');
const mongoose = require('mongoose');
const User = require('../models/User');

const createRecord = async (req, res) =>
{
   try
   {
      if (req.user.role === 'VIEWER')
      {
         return res.status(403).json(
         {
            message: 'Access denied'
         });
      }

      const { amount, type, category, date, notes, createdBy } = req.body;

      if (amount === undefined || !type || !category)
      {
         return res.status(400).json(
         {
            message: 'Amount, type & category required'
         });
      }

      if (typeof amount !== 'number' || amount <= 0)
      {
         return res.status(400).json(
         {
            message: 'Amount must be a positive number'
         });
      }

      if (!['income', 'expense'].includes(type))
      {
         return res.status(400).json(
         {
            message: 'Invalid record type'
         });
      }

      if (date && isNaN(new Date(date).getTime()))
      {
         return res.status(400).json(
         {
            message: 'Invalid date format'
         });
      }

      let owner = req.user._id;

      if (req.user.role === 'ADMIN' && createdBy)
      {
         if (!mongoose.Types.ObjectId.isValid(createdBy))
         {
            return res.status(400).json(
            {
               message: 'Invalid user ID'
            });
         }

         const userExists = await User.findById(createdBy);

         if (!userExists)
         {
            return res.status(404).json(
            {
               message: 'User not found'
            });
         }

         owner = createdBy;
      }

      const record = await Record.create(
      {
         amount,
         type,
         category,
         date,
         notes,
         createdBy: owner
      });

      return res.status(201).json(
      {
         message: 'Record created successfully',
         record
      });
   }
   catch (error)
   {
      return res.status(500).json(
      {
         message: 'Server error',
         error: error.message
      });
   }
};

const getRecords = async (req, res) =>
{
   try
   {
      const { type, category, startDate, endDate, search } = req.query;

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      let filter = { isDeleted: false };

      if (req.query.startDate || req.query.endDate)
      {
         filter.date = {};

         if (req.query.startDate)
         {
            filter.date.$gte = new Date(req.query.startDate);
         }

         if (req.query.endDate)
         {
            filter.date.$lte = new Date(req.query.endDate);
         }
      }

      if (req.user.role === 'VIEWER')
      {
         filter.createdBy = req.user._id;
      }

      if (type)
      {
         if (!['income', 'expense'].includes(type))
         {
            return res.status(400).json(
            {
               message: 'Invalid record type'
            });
         }

         filter.type = type;
      }

      if (category)
      {
         filter.category = category;
      }

      if (startDate || endDate)
      {
         filter.date = {};

         if (startDate)
         {
            const start = new Date(startDate);
            if (isNaN(start.getTime()))
            {
               return res.status(400).json(
               {
                  message: 'Invalid startDate'
               });
            }
            filter.date.$gte = start;
         }

         if (endDate)
         {
            const end = new Date(endDate);
            if (isNaN(end.getTime()))
            {
               return res.status(400).json(
               {
                  message: 'Invalid endDate'
               });
            }
            filter.date.$lte = end;
         }
      }

      if (search)
      {
         filter.$or = [
            { category: { $regex: search, $options: 'i' } },
            { notes: { $regex: search, $options: 'i' } }
         ];
      }

      const total = await Record.countDocuments(filter);

      const records = await Record.find(filter)
         .populate('createdBy', 'name email')
         .sort({ date: -1 })
         .skip(skip)
         .limit(limit);

      return res.status(200).json(
      {
         count: records.length,
         total,
         page,
         pages: Math.ceil(total / limit),
         records
      });
   }
   catch (error)
   {
      return res.status(500).json(
      {
         message: 'Server error',
         error: error.message
      });
   }
};

const updateRecord = async (req, res) =>
{
   try
   {
      if (!mongoose.Types.ObjectId.isValid(req.params.id))
      {
         return res.status(400).json(
         {
            message: 'Invalid record ID'
         });
      }

      let record;

      if (req.user.role === 'ADMIN')
      {
         record = await Record.findById(req.params.id);
      }
      else if (req.user.role === 'ANALYST')
      {
         record = await Record.findOne({ _id: req.params.id, createdBy: req.user._id });
      }
      else
      {
         return res.status(403).json(
         {
            message: 'Access denied'
         });
      }

      if (!record)
      {
         return res.status(404).json(
         {
            message: 'Record not found'
         });
      }

      const { amount, type, category, date, notes } = req.body;

      if (type && !['income', 'expense'].includes(type))
      {
         return res.status(400).json(
         {
            message: 'Invalid record type'
         });
      }

      if (amount !== undefined)
      {
         if (typeof amount !== 'number' || amount <= 0)
         {
            return res.status(400).json(
            {
               message: 'Amount must be a positive number'
            });
         }
         record.amount = amount;
      }

      if (date !== undefined)
      {
         if (isNaN(new Date(date).getTime()))
         {
            return res.status(400).json(
            {
               message: 'Invalid date format'
            });
         }
         record.date = date;
      }

      if (type !== undefined) record.type = type;
      if (category !== undefined) record.category = category;
      if (notes !== undefined) record.notes = notes;

      await record.save();

      return res.status(200).json(
      {
         message: 'Record updated successfully',
         record
      });
   }
   catch (error)
   {
      return res.status(500).json(
      {
         message: 'Server error',
         error: error.message
      });
   }
};

const deleteRecord = async (req, res) =>
{
   try
   {
      if (!mongoose.Types.ObjectId.isValid(req.params.id))
      {
         return res.status(400).json(
         {
            message: 'Invalid record ID'
         });
      }

      let record;

      if (req.user.role === 'ADMIN')
      {
         record = await Record.findById(req.params.id);
      }
      else if (req.user.role === 'ANALYST')
      {
         record = await Record.findOne({ _id: req.params.id, createdBy: req.user._id });
      }
      else
      {
         return res.status(403).json(
         {
            message: 'Access denied'
         });
      }

      if (!record)
      {
         return res.status(404).json(
         {
            message: 'Record not found'
         });
      }

      record.isDeleted = true;
      await record.save();

      return res.status(200).json(
      {
         message: 'Record deleted successfully'
      });
   }
   catch (error)
   {
      return res.status(500).json(
      {
         message: 'Server error',
         error: error.message
      });
   }
};

module.exports =
{
   createRecord,
   getRecords,
   updateRecord,
   deleteRecord
};