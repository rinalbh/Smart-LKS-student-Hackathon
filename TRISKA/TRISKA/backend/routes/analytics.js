const express = require('express');
const router = express.Router();

const analyticsData = require('../data/analytics.json');

// Данные для дашборда
router.get('/dashboard', (req, res) => {
    res.json({
        success: true,
        data: analyticsData.dashboard
    });
});

// Таймлайн дедлайнов
router.get('/timeline', (req, res) => {
    res.json({
        success: true,
        data: analyticsData.timeline
    });
});

module.exports = router;