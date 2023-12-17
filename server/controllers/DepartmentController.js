const Department = require('../models/DepartmentModel');

// Lấy tất cả chuyên ngành
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy chuyên ngành' });
  }
};