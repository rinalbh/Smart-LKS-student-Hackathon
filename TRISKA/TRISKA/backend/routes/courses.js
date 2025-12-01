const express = require('express');
const router = express.Router();

const coursesData = require('../data/courses.json');

// Все курсы
router.get('/', (req, res) => {
    res.json({
        success: true,
        data: coursesData
    });
});

router.post('/', async (req, res) => {
    try {
        const newCourse = {
            id: Date.now(), // Простой ID на основе времени
            ...req.body
        };
        
        // Добавляем новый курс
        coursesData.courses.push(newCourse);
        
        // Сохраняем в файл
        await fs.writeFile(
            path.join(__dirname, '../data/courses.json'),
            JSON.stringify(coursesData, null, 2)
        );
        
        res.json({
            success: true,
            message: 'Курс успешно добавлен',
            data: newCourse
        });
    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при добавлении курса: ' + error.message
        });
    }
});

module.exports = router;