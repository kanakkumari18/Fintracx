const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) =>
{
   try
   {
      const authorizationHeader = req.headers.authorization;

      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer '))
      {
         return res.status(401).json(
         {
            message: 'Access Denied'
         });
      }

      const token = authorizationHeader.split(' ')[1];

      if (!process.env.JWT_SECRET)
      {
         return res.status(500).json(
         {
            message: 'JWT Secret Issues'
         });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password');

      if (!user || !user.isActive)
      {
         return res.status(401).json(
         {
            message: 'User not found'
         });
      }

      req.user = user;

      next();
   }
   catch (error)
   {
      if (error.name === 'TokenExpiredError')
      {
         return res.status(401).json(
         {
            message: 'Token expired'
         });
      }

      if (error.name === 'JsonWebTokenError')
      {
         return res.status(401).json(
         {
            message: 'Invalid token'
         });
      }

      return res.status(500).json(
      {
         message: 'Validation error',
         error: error.message
      });
   }
};

module.exports = auth;