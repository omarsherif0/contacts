const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

dotenv.config();
require('./models/passport'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Basic route
console.log("Listening on port:", PORT);
app.get('/', (req, res) => {
  res.send('API is working!');
});

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboardRoutes'));

app.use('/profiles', require('./routes/profileRoutes'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);});
  })
  .catch(err => console.error('MongoDB connection error:', err));
