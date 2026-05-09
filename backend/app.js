const express = require('express');
const cors = require('cors');

const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const helmet = require('helmet');

const authRoutes = require('./routes/authRoutes');
const recordRoutes = require('./routes/recordRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({
   windowMs: 15 * 60 * 1000,
   max: 100
});
app.use(limiter);

app.get('/', (req, res) => {
   res.send('Finance Backend API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/users', userRoutes);

app.use((req, res) => {
   res.status(404).json({
      message: 'Route not found'
   });
});

app.use((err, req, res, next) => {
   console.error(err.stack);

   res.status(err.status || 500).json({
      message: err.message || 'Internal server error'
   });
});

module.exports = app;