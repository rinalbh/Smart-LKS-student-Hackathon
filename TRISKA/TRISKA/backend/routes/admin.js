const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Простое хранилище в памяти (временное решение)
let courses = [
    {
        "id": 1,
        "name": "Математический анализ",
        "shortName": "Матан",
        "instructor": "Кузьмина Л.И.",
        "progress": 85,
        "status": "Активный",
        "modules": "1,2,3,4"
    },
    {
        "id": 2,
        "name": "Языки программирования", 
        "shortName": "Программирование",
        "instructor": "Булгаков С.А.",
        "progress": 72,
        "status": "Активный",
        "modules": "1,2,3,4"
    }
];

// Все курсы
router.get('/', (req, res) => {
    res.json({
        success: true,
        data: { courses: courses }
    });
});

// Добавление курса
router.post('/', (req, res) => {
    try {
        const newCourse = {
            id: Date.now(),
            ...req.body
        };
        
        courses.push(newCourse);
        
        console.log('✅ Курс добавлен в память:', newCourse);
        console.log('📊 Всего курсов:', courses.length);
        
        res.json({
            success: true,
            message: 'Курс успешно добавлен',
            data: newCourse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка: ' + error.message
        });
    }
});

module.exports = router;