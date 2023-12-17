// routes/record.js
const express = require('express');
const router = express.Router();
const academicYearController = require('../controllers/AcademicYearController');
const departmentController = require('../controllers/DepartmentController');
const teacherController = require('../controllers/TeacherController');
const studentController = require('../controllers/StudentController');
// Routes for 'academicYears'
router.get('/academicYears', academicYearController.getAllAcademicYears);
// Routes for 'departments'
router.get('/departments', departmentController.getAllDepartments);
// Routes for 'students'
router.post('/students', studentController.addStudent);
router.get('/students/:department/:academicyear', studentController.getAllStudents);
router.get('/students/:studentId', studentController.getStudentById);
router.put('/students/:studentId', studentController.editStudent);
router.delete('/students/:studentId', studentController.deleteStudent);
// Routes for 'teachers'
router.post('/teachers', teacherController.addTeacher);
router.get('/teachers/:department', teacherController.getAllTeachers);
router.get('/teachers/:teacherId', teacherController.getTeacherById);
router.put('/teachers/:teacherId', teacherController.editTeacher);
router.delete('/teachers/:teacherId', teacherController.deleteTeacher);

module.exports = router;