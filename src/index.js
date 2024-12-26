const express = require("express");
const connection = require("./config/connectdb");
const superRouter = require("./routes/superAdmin.route")
const adminRouter = require("./routes/admin.route")
const productRouter = require("./routes/product.route")
const slotRoutes = require("./routes/slots.route")
const userRouter = require("./routes/user.route")
const paymentRouter = require("./routes/razorPay.route")
const appointmentRouter = require("./routes/appointment.route")
const zoomMeetingRouter = require("./routes/onlineConsultation.route")
const dashBoard = require("./routes/dashBoard.route")

require("dotenv").config();
const cors = require("cors");

const app = express();



app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use("/upload", express.static("src/fileStorage"))
connection();


app.use("/super", superRouter);
app.use("/admin", adminRouter);
app.use("/pharmacy", productRouter)
app.use("/api", slotRoutes);
app.use("/user", userRouter);
app.use("/api/payment", paymentRouter)
app.use("/api/appointment", appointmentRouter);
app.use("/api/zoommetting", zoomMeetingRouter)
app.use("/api/dashboard",dashBoard)

const port = 7000 || 8000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
