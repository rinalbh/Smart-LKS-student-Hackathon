const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const coursesRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');
const studentsRoutes = require('./routes/students');

app.use('/api/courses', coursesRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/students', studentsRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/admin.html'));
});

app.listen(PORT, () => {
    console.log('🚀 СДО РТУ МИРЭА запущен!');
    console.log('📍 Используется admin.js для API курсов');
    console.log(`📍 Админка: http://localhost:${PORT}/admin`);
});