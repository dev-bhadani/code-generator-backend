const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
const formRoutes = require('./src/routes/formRoutes');
const exportRoutes = require('./src/routes/exportRoutes');

dotenv.config();

// connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/forms', formRoutes);
app.use('/api/export', exportRoutes);

app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
