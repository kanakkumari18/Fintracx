require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect(process.env.MONGO_URI)
.then(() =>
{
   console.log('Database connected');

   const PORT = process.env.PORT || 5000;

   app.listen(PORT, () =>
   {
      console.log(`Server running on port ${PORT}`);
   });
})
.catch((error) =>
{
   console.error('DB connection error:', error);
});

