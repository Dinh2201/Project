const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const connectDB = async () => {
  try {
    const connection = await mongoose.connect('mongodb://0.0.0.0:27017/MEVNDatabase', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Kết nối cơ sở dữ liệu thành công");
    return connection.connection.db;
  } catch (error) {
    console.error("Lỗi kết nối cơ sở dữ liệu:", error);
    throw error;
  }
};

module.exports = {
  async up(db) {
    const database = await connectDB();

    const usersCollection = database.collection("users");
    const academicyearsCollection = database.collection("academicyears");
    const departmentsCollection = database.collection("departments");

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('12345678', saltRounds);

    await usersCollection.insertOne({
      UserName: 'admin',
      Password: hashedPassword,
    });

    await academicyearsCollection.insertMany([
      {
        YearName: '2018-2022'
      }
    ]);

    await departmentsCollection.insertMany([
      {
        DepartmentName: "Tin học ứng dụng",
        Description: 'Tin học ứng dụng'
      }
    ]);

  },

  async down(db) {
    const database = await connectDB();

    const usersCollection = database.collection("users");
    const academicyearsCollection = database.collection("academicyears");
    const departmentsCollection = database.collection("departments");

    await departmentsCollection.deleteMany({});

    await usersCollection.deleteMany({});

    await academicyearsCollection.deleteMany({});

  }
};