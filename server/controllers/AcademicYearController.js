const AcademicYear = require('../models/AcademicYearModel');

// Lấy tất cả niên khóa
exports.getAllAcademicYears = async (req, res) => {
  try {
    const academicYears = await AcademicYear.find();
    res.json(academicYears);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy niên khóa' });
  }
};