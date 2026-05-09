const summaryService = require('../services/summaryService');

const getSummary = async (req, res) =>
{
   try
   {
      if (!req.user)
      {
         return res.status(401).json(
         {
            message: 'Unauthorized. User not authenticated'
         });
      }

      const userId = req.user._id;
      const role = req.user.role;

      const
      [
         overview,
         categoryTotals,
         recentTransactions,
         monthlyTrends,
         weeklyTrends
      ] = await Promise.all(
      [
         summaryService.getOverview(userId, role),
         summaryService.getCategoryTotals(userId, role),
         summaryService.getRecentTransactions(userId, role),
         summaryService.getMonthlyTrends(userId, role),
         summaryService.getWeeklyTrends(userId, role)
      ]);

      return res.status(200).json(
      {
         message: 'Summary fetched successfully',
         data:
         {
            overview,
            categoryTotals,
            recentTransactions,
            monthlyTrends,
            weeklyTrends
         }
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
   getSummary
};