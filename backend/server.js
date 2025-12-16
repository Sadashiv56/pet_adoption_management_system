require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pets');
const applicationRoutes = require('./routes/applications');
const app = express();

connectDB();
// Configure CORS to allow frontend origin and Authorization header for preflight
const corsOptions = {
	origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
	methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
	allowedHeaders: ['Content-Type','Authorization'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/applications', applicationRoutes);

app.get('/', (req, res) => res.send('Pet Adoption API'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
