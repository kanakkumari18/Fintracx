const mongoose = require('mongoose');
const User = require('../models/User');

const getUsers = async (req, res) =>
{
   try
   {
      if (req.user.role !== 'ADMIN')
      {
         return res.status(403).json(
         {
            message: 'Access denied'
         });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const total = await User.countDocuments();

      const users = await User.find()
         .select('-password')
         .skip(skip)
         .limit(limit);

      return res.status(200).json(
      {
         count: users.length,
         page,
         limit,
         total,
         totalPages: Math.ceil(total / limit),
         users
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

const updateUserRole = async (req, res) =>
{
   try
   {
      if (req.user.role !== 'ADMIN')
      {
         return res.status(403).json(
         {
            message: 'Access denied'
         });
      }

      if (!mongoose.Types.ObjectId.isValid(req.params.id))
      {
         return res.status(400).json(
         {
            message: 'Invalid user ID'
         });
      }

      if (req.user._id.toString() === req.params.id)
      {
         return res.status(400).json(
         {
            message: 'Cannot change your own role'
         });
      }

      const { role } = req.body;

      if (!['VIEWER', 'ANALYST', 'ADMIN'].includes(role))
      {
         return res.status(400).json(
         {
            message: 'Invalid role'
         });
      }

      const user = await User.findById(req.params.id);

      if (!user)
      {
         return res.status(404).json(
         {
            message: 'User not found'
         });
      }

      if (role !== 'ADMIN')
      {
         const adminCount = await User.countDocuments({ role: 'ADMIN' });

         if (adminCount <= 1 && user.role === 'ADMIN')
         {
            return res.status(400).json(
            {
               message: 'At least one admin required'
            });
         }
      }

      user.role = role;
      await user.save();

      return res.status(200).json(
      {
         message: 'User role updated',
         user: {
            ...user.toObject(),
            password: undefined
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

const updateUserStatus = async (req, res) =>
{
   try
   {
      if (req.user.role !== 'ADMIN')
      {
         return res.status(403).json(
         {
            message: 'Access denied'
         });
      }

      if (!mongoose.Types.ObjectId.isValid(req.params.id))
      {
         return res.status(400).json(
         {
            message: 'Invalid user ID'
         });
      }

      if (req.user._id.toString() === req.params.id)
      {
         return res.status(400).json(
         {
            message: 'Cannot deactivate yourself'
         });
      }

      const { isActive } = req.body;

      if (typeof isActive !== 'boolean')
      {
         return res.status(400).json(
         {
            message: 'isActive must be true or false'
         });
      }

      const user = await User.findById(req.params.id);

      if (!user)
      {
         return res.status(404).json(
         {
            message: 'User not found'
         });
      }

      if (!isActive && user.role === 'ADMIN')
      {
         const adminCount = await User.countDocuments({ role: 'ADMIN', isActive: true });

         if (adminCount <= 1)
         {
            return res.status(400).json(
            {
               message: 'At least one active admin required'
            });
         }
      }

      user.isActive = isActive;
      await user.save();

      return res.status(200).json(
      {
         message: 'User status updated',
         user: {
            ...user.toObject(),
            password: undefined
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

const deleteUser = async (req, res) =>
{
   try
   {
      if (req.user.role !== 'ADMIN')
      {
         return res.status(403).json(
         {
            message: 'Access denied'
         });
      }

      if (!mongoose.Types.ObjectId.isValid(req.params.id))
      {
         return res.status(400).json(
         {
            message: 'Invalid user ID'
         });
      }

      if (req.user._id.toString() === req.params.id)
      {
         return res.status(400).json(
         {
            message: 'Cannot delete yourself'
         });
      }

      const user = await User.findById(req.params.id);

      if (!user)
      {
         return res.status(404).json(
         {
            message: 'User not found'
         });
      }

      if (user.role === 'ADMIN')
      {
         const adminCount = await User.countDocuments({ role: 'ADMIN' });

         if (adminCount <= 1)
         {
            return res.status(400).json(
            {
               message: 'At least one admin required'
            });
         }
      }

      await User.findByIdAndDelete(req.params.id);

      return res.status(200).json(
      {
         message: 'User deleted successfully'
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


const getMyProfile = async (req, res) =>
{
   try
   {
      const user = await User.findById(req.user._id).select('-password');

      if (!user)
      {
         return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ user });
   }
   catch (error)
   {
      return res.status(500).json({
         message: 'Server error',
         error: error.message
      });
   }
};

const updateMyProfile = async (req, res) =>
{
   try
   {
      const { name, email } = req.body;

      const user = await User.findById(req.user._id);

      if (!user)
      {
         return res.status(404).json({ message: 'User not found' });
      }

      if (name) user.name = name;
      if (email) user.email = email;

      await user.save();

      return res.status(200).json({
         message: 'Profile updated successfully',
         user: {
            ...user.toObject(),
            password: undefined
         }
      });
   }
   catch (error)
   {
      return res.status(500).json({
         message: 'Server error',
         error: error.message
      });
   }
};

const bcrypt = require('bcryptjs');

const changePassword = async (req, res) =>
{
   try
   {
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user._id).select('+password');

      if (!user)
      {
         return res.status(404).json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch)
      {
         return res.status(400).json({ message: 'Current password is incorrect' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);

      await user.save();

      return res.status(200).json({
         message: 'Password updated successfully'
      });
   }
   catch (error)
   {
      return res.status(500).json({
         message: 'Server error',
         error: error.message
      });
   }
};

const deleteMyAccount = async (req, res) =>
{
   try
   {
      const user = await User.findById(req.user._id);

      if (!user)
      {
         return res.status(404).json({ message: 'User not found' });
      }

      // Prevent deleting last admin
      if (user.role === 'ADMIN')
      {
         const adminCount = await User.countDocuments({ role: 'ADMIN' });

         if (adminCount <= 1)
         {
            return res.status(400).json({
               message: 'At least one admin required'
            });
         }
      }

      await User.findByIdAndDelete(req.user._id);

      return res.status(200).json({
         message: 'Account deleted successfully'
      });
   }
   catch (error)
   {
      return res.status(500).json({
         message: 'Server error',
         error: error.message
      });
   }
};

module.exports =
{
   getUsers,
   updateUserRole,
   updateUserStatus,
   deleteUser,
   getMyProfile,
   updateMyProfile,
   changePassword,
   deleteMyAccount
};