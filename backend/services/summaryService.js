const Record = require('../models/Record');
const mongoose = require('mongoose');

const toObjectId = (id) =>
{
   return new mongoose.Types.ObjectId(id);
};

const buildMatch = (userId, role) =>
{
   if (role === 'VIEWER')
   {
      return { createdBy: toObjectId(userId) };
   }

   return {};
};

const getOverview = async (userId, role) =>
{
   const match = { ...buildMatch(userId, role), isDeleted: false };

   const result = await Record.aggregate(
   [
      {
         $match: match
      },
      {
         $group:
         {
            _id: '$type',
            total: { $sum: '$amount' }
         }
      }
   ]);

   let income = 0;
   let expense = 0;

   result.forEach((item) =>
   {
      if (item._id === 'income') income = item.total;
      if (item._id === 'expense') expense = item.total;
   });

   return {
      income,
      expense,
      netBalance: income - expense
   };
};

const getCategoryTotals = async (userId, role) =>
{
   const match = { ...buildMatch(userId, role), isDeleted: false };

   return Record.aggregate(
   [
      {
         $match: match
      },
      {
         $group:
         {
            _id:
            {
               type: '$type',
               category: '$category'
            },
            total: { $sum: '$amount' }
         }
      },
      {
         $project:
         {
            _id: 0,
            type: '$_id.type',
            category: '$_id.category',
            total: 1
         }
      },
      {
         $sort:
         {
            type: 1,
            total: -1
         }
      }
   ]);
};

const getRecentTransactions = async (userId, role) =>
{
   const filter = role === 'VIEWER'
      ? { createdBy: toObjectId(userId), isDeleted: false }
      : { isDeleted: false };

   return Record.find(filter)
      .sort({ createdAt: -1 })
      .limit(5)
      .select('amount type category date notes');
};

const getMonthlyTrends = async (userId, role) =>
{
   const match = { ...buildMatch(userId, role), isDeleted: false };

   return Record.aggregate(
   [
      {
         $match: match
      },
      {
         $group:
         {
            _id:
            {
               year: { $year: '$date' },
               month: { $month: '$date' },
               type: '$type'
            },
            total: { $sum: '$amount' }
         }
      },
      {
         $project:
         {
            _id: 0,
            year: '$_id.year',
            month: '$_id.month',
            type: '$_id.type',
            total: 1
         }
      },
      {
         $sort:
         {
            year: -1,
            month: -1,
            type: 1
         }
      }
   ]);
};

const getWeeklyTrends = async (userId, role) =>
{
   const match = { ...buildMatch(userId, role), isDeleted: false };

   return Record.aggregate(
   [
      {
         $match: match
      },
      {
         $group:
         {
            _id:
            {
               year: { $year: '$date' },
               week: { $week: '$date' },
               type: '$type'
            },
            total: { $sum: '$amount' }
         }
      },
      {
         $project:
         {
            _id: 0,
            year: '$_id.year',
            week: '$_id.week',
            type: '$_id.type',
            total: 1
         }
      },
      {
         $sort:
         {
            year: -1,
            week: -1,
            type: 1
         }
      }
   ]);
};

module.exports =
{
   getOverview,
   getCategoryTotals,
   getRecentTransactions,
   getMonthlyTrends,
   getWeeklyTrends
};