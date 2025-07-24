require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

// Connect DB
connectDB();

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Define allowed origins (for local and production)
const allowedOrigins = [
  'http://localhost:5173', // Local Vite frontend
  'https://mellow-eclair-ff0c91.netlify.app' // Replace with your production frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed for this origin'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

// Route files
const auth = require('./routes/authRoutes');
const blog = require('./routes/blogRoutes');
const projects = require('./routes/projectRoutes');
const skillRoutes = require('./routes/skillRoutes');
const workExperienceRoutes = require('./routes/workExperienceRoutes.js');
const educationRoutes = require('./routes/educationRoutes.js');
const certificateRoutes = require('./routes/certificateRoutes.js');
const recentActivityRoutes = require('./routes/recentActivityRoutes.js');

// Routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/blogs', blog);
app.use('/api/v1/projects', projects);
app.use('/api/v1/skills', skillRoutes);
app.use('/api/v1/work-experience', workExperienceRoutes);
app.use('/api/v1/education', educationRoutes);
app.use('/api/v1/certificates', certificateRoutes);
app.use('/api/v1/recent-activity', recentActivityRoutes);

// Root API response
app.get('/', (req, res) => {
  res.status(200).send('Hi This is Pavithan Portfolio Backend');
});

// Error handling
app.use(errorHandler);

module.exports = app;
