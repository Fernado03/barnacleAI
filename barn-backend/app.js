require("dotenv").config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const config = require("./config/config");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const createHttpError = require("http-errors");

// Import routes
const authRoutes = require('./routes/authRoutes');
const marineDataRoutes = require('./routes/marineDataRoutes');
const fleetRoutes = require('./routes/fleetRoutes');
const esgRoutes = require('./routes/esgRoutes');
const predictionsRoutes = require('./routes/predictionsRoutes');

const app = express();

const PORT = config.port;
connectDB();

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'http://localhost:3000', 
        'http://127.0.0.1:5173',
        'https://barnacle-ai.vercel.app',
        'https://*.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/marine-data', marineDataRoutes);
app.use('/api/fleet', fleetRoutes);
app.use('/api/esg', esgRoutes);
app.use('/api/predictions', predictionsRoutes);

app.get("/", (req, res) => {

    res.json({message: "Hello World"})
})

// Global Error Handler
app.use(globalErrorHandler);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})