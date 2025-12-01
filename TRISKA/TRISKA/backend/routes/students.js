const express = require('express');
const router = express.Router();

const studentsData = require('../data/students.json');

router.get('/:id', (req, res) => {
    const studentId = req.params.id;
    const student = studentsData.students.find(s => s.id === studentId);
    
    if (!student) {
        return res.status(404).json({
            success: false,
            message: 'Студент не найден'
        });
    }
    
    res.json({
        success: true,
        data: student
    });
});

module.exports = router;