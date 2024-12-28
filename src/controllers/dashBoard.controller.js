const { admin_data } = require("../models/admin.model");
const Appointment = require("../models/apointment.model");
const { User } = require("../models/user.model");
const ZoomMeeting = require("../models/onlineAppointment.model");

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
const getDailyAppointment = async (req, res) => {
  try {
    const usersData = await Appointment.aggregate([
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
const getDailyAdmin = async (req, res) => {
  try {
    const usersData = await admin_data.aggregate([
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

const getDailyRevenue = async (req, res) => {
  try {
    // Aggregate the revenue by date
    const revenueData = await Appointment.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalRevenue: { $sum: "$payment" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json(revenueData);
  } catch (error) {
    console.error("Error fetching daily revenue:", error);
    res.status(500).json({ error: "Server error" });
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

const getTotalOnlinemeeting = async (req, res) => {
  try {
    const totalOnlineAppointments = await ZoomMeeting.countDocuments();
    res.status(200).json({ totalOnlineAppointments });
  } catch (error) {
    res.json({
      error: "Internal server error",
    });
  }
};

/////ADMIN
const getTotalRevenue = async (req, res) => {
  try {
    const { doctorId } = req.query;

    if (!doctorId) {
      return res.status(400).json({ error: "doctorId is required" });
    }

    const appointments = await Appointment.find({
      doctorId: doctorId,
      status: "Accepted",
    });

    if (!appointments || appointments.length === 0) {
      console.log("No appointments found for doctor:", doctorId);
      return res.status(200).json(0); // Return 0 if no appointments found
    }

    const totalRevenue = appointments.reduce(
      (acc, appointment) =>
        acc + parseFloat(appointment.payment || 0), // Ensure payment is valid
      0
    );

    console.log("Total Revenue:", totalRevenue);

    res.status(200).json({totalRevenue: totalRevenue}); // Return total revenue
  } catch (err) {
    console.error("Error fetching total revenue:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Get daily revenue for a specific doctor
const getDailyRevenueadmin = async (req, res) => {
  try {
    const { doctorId } = req.query; // Get doctorId from query params

    // Fetch all appointments for the doctor
    const appointments = await Appointment.find({
      doctorId: doctorId,
      status: "Accepted",
    });

    // Group appointments by date and calculate revenue for each day
    const dailyRevenue = {};

    appointments.forEach((appointment) => {
      const date = appointment.date.toISOString().split("T")[0]; // Get the date in YYYY-MM-DD format
      const payment = parseFloat(appointment.payment);

      if (!dailyRevenue[date]) {
        dailyRevenue[date] = 0;
      }
      dailyRevenue[date] += payment;
    });

    // Convert dailyRevenue object to array for the response
    const dailyRevenueArray = Object.keys(dailyRevenue).map((date) => ({
      date: date,
      totalRevenue: dailyRevenue[date],
    }));

    // Sort by date (ascending order)
    dailyRevenueArray.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).json(dailyRevenueArray); // Send daily revenue data
  } catch (err) {
    console.error("Error fetching daily revenue:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getForDailyRevenue = async (req, res) => {
  const { doctorId } = req.query;  // Get doctorId from the query string
  const date = req.query.date;      // Get the specific date from the query string

  if (!doctorId || !date) {
    return res.status(400).json({ error: "Doctor ID and Date are required" });
  }

  try {
    const startDate = new Date(date); // This will be in the format "YYYY-MM-DD"
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1); // Get the next day's start time

    // MongoDB aggregation pipeline
    const aggregationPipeline = [
      {
        $match: {
          doctorId: doctorId,
          createdAt: { $gte: startDate, $lt: endDate },  // Filter based on createdAt
        },
      },
      {
        $group: {
          _id: null, // No need to group by any specific field
          totalRevenue: { $sum: "$payment" },  // Sum the payment field
        },
      },
      {
        $project: {
          _id: 0,  
          totalRevenue: 1,
          date: { $dateToString: { format: "%Y-%m-%d", date: startDate } },  // Format the date
        },
      },
    ];

    // Run the aggregation pipeline
    const result = await Appointment.aggregate(aggregationPipeline);

    // Check if there is any revenue data
    if (result.length === 0) {
      return res.status(200).json({ message: "No revenue data for this day" });
    }

    // Return the aggregated result
    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error fetching daily revenue:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Revenue Per Week
const getRevenuePerWeek = async (req, res) => {
  try {
    const { doctorId } = req.query;

    if (!doctorId) {
      return res.status(400).json({ error: "Doctor ID is required" });
    }

    // Fetch all accepted appointments for the given doctor
    const appointments = await Appointment.find({
      doctorId,
      status: "Accepted",
    });

    // Group revenue by days of the week
    const daysOfWeek = [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ];
    const revenuePerDay = appointments.reduce((acc, appt) => {
      const date = new Date(appt.date);
      const dayIndex = date.getDay(); // 0 (Sunday) to 6 (Saturday)
      const dayName = daysOfWeek[(dayIndex + 6) % 7]; // Shift so 0 = Monday, 6 = Sunday

      if (!acc[dayName]) acc[dayName] = 0;
      acc[dayName] += Number(appt.payment);
      return acc;
    }, {});

    // Format result as an array of objects
    const result = daysOfWeek.map((day) => ({
      day,
      totalRevenue: revenuePerDay[day] || 0, // Default to 0 if no revenue for that day
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDailyUsers,
  getTotalAdmins,
  getTotalAppointments,
  getTotalUsers,
  getDailyAppointment,
  getDailyAdmin,
  getDailyRevenue,
  getTotalOnlinemeeting,
  getTotalRevenue,
  getDailyRevenueadmin,
  getRevenuePerWeek,
  getForDailyRevenue
};
