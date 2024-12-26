const { admin_data } = require("../models/admin.model");
const Appointment = require("../models/apointment.model")
const { User } = require("../models/user.model");

// const getMonthlyRevenue = async (req, res) => {
//     try {
//       const revenueData = await Revenue.find();
//       res.status(200).json(revenueData);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   };

const getDailyUsers = async (req, res) => {
    try {
      const usersData = await User.aggregate([
        {
          $group: {
            _id: { $dayOfWeek: "$createdAt" },
            users: { $sum: 1 },
          },
        },
        {
          $project: {
            day: "$_id",
            users: 1,
            _id: 0,
          },
        },
      ]);
  
      const daysMapping = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const formattedData = usersData.map((data) => ({
        day: daysMapping[data.day - 1],
        users: data.users,
      }));
  
      res.status(200).json(formattedData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  const getTotalUsers = async (req, res) => {
    try {
      const totalUsers = await User.countDocuments(); 
      res.status(200).json({ totalUsers });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const getTotalAdmins = async (req, res) => {
    try {
      const totalAdmins = await admin_data.countDocuments();
      res.status(200).json({ totalAdmins });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const getTotalAppointments = async (req, res) => {
    try {
      const totalAppointments = await Appointment.countDocuments();
      res.status(200).json({ totalAppointments });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  module.exports = {
    getDailyUsers,
    getTotalAdmins,
    getTotalAppointments,
    getTotalUsers
  };