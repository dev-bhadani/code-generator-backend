const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
const formRoutes = require('./src/routes/formRoutes');
const exportRoutes = require('./src/routes/exportRoutes');

dotenv.config();

// connectDB().then(() => console.log('Connected to MongoDB')).catch((err) => console.error('Failed to connect to MongoDB:', err));

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use('/api/forms', formRoutes);
app.use('/api/export', exportRoutes);

app.use((err, req, res) => {
    res.status(500).json({success: false, message: err.message});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
