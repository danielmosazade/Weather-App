  const express = require('express');
  const mongoose = require('mongoose');
  require('dotenv').config();
  const cors = require('cors');

  const authRoutes = require('./routes/Auth');

  const app = express();
  app.use(express.json());
 const allowedOrigins = [
  'http://localhost:3000',
  'https://mzgn-htb.onrender.com/' // 👈 החלף ל-URL האמיתי של ה-Frontend שלך
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

  const cookieParser = require("cookie-parser");
  app.use(cookieParser());


  // חיבור למסד נתונים
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

  // שימוש בראוטים
  app.use('/api/auth', authRoutes);

  app.get('/', (req, res) => {
    res.send('API is running');
  });

  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
  });
