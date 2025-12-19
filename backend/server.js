
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/atelier', require('./routes/atelierRoutes'));
app.use('/api/public', require('./routes/publicRoutes'));
app.use('/api/admin', require('./middleware/auth').protect, require('./middleware/auth').restrictToSuperadmin, require('./routes/adminRoutes'));

// Health Check
app.get('/api/health', (req, res) => res.json({ status: 'ok', architecture: 'MVC' }));

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in MVC mode`);
});
