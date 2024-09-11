const express = require("express");

const path = require("path");
const rootDir = require("./utils/path");

//other needed modules
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");

process.env.TZ = "Asia/Kolkata";

// middleware or to set router
const homeRoutes = require("./routes/home");
const usersRoutes = require("./routes/users");

//Expert routers
const cronJobsRoutes = require("./routes/Expert/CronJobs");
const resetPasswordRoutes = require("./routes/Expert/ResetPassword");

//admin routers
const appointmentRoutes = require("./routes/Appointment");
const baseApiRoutes = require("./routes/BaseApi");
const blogCategoryRoutes = require("./routes/BlogCategory");
const blogRoutes = require("./routes/Blog");
const botsRoutes = require("./routes/Bots");
const categoryRoutes = require("./routes/Category");
const chartRoutes = require("./routes/Chart");
const chatsRoutes = require("./routes/Chats");
const classRoutes = require("./routes/Class");
const classesRoutes = require("./routes/Classes");
const dashboardRoutes = require("./routes/Dashboard");
const dealsRoutes = require("./routes/Deals");
const employeeListRoutes = require("./routes/EmployeeList");
const eventRoutes = require("./routes/Event");
const expenseRoutes = require("./routes/Expense");
const expertAuthRoutes = require("./routes/ExpertAuth");
const expertDetailRoutes = require("./routes/ExpertDetail");
const graphRoutes = require("./routes/Graph");
const inventoryRoutes = require("./routes/Inventory");
const membershipRoutes = require("./routes/Membership");
const personalTrainingRoutes = require("./routes/PersonalTraining");
const photoTrackingRoutes = require("./routes/PhotoTracking");
const POSRoutes = require("./routes/POS");
const programManagementRoutes = require("./routes/ProgramManagement");
const purchaseRoutes = require("./routes/Purchase");
const supplierRoutes = require("./routes/Supplier");
const userListRoutes = require("./routes/UserList");

//users routers
const articleRoutes = require("./routes/users/Article");
const basicRoutes = require("./routes/users/Basic");
const botRoutes = require("./routes/users/Bot");
const chatRoutes = require("./routes/users/Chat");
const consultOnlineRoutes = require("./routes/users/ConsultOnline");
const dashRoutes = require("./routes/users/Dash");
const deviceRoutes = require("./routes/users/Device");
const diaryRoutes = require("./routes/users/Diary");
const dietRoutes = require("./routes/users/Diet");
const exerciseRoutes = require("./routes/users/Exercise");
const goalRoutes = require("./routes/users/Goal");
const gymClassRoutes = require("./routes/users/GymClass");
const gymRoutes = require("./routes/users/Gym");
const inquiryRoutes = require("./routes/users/Inquiry");
const leadBotsRoutes = require("./routes/users/LeadBots");
const listingRoutes = require("./routes/users/Listing");
const loginRoutes = require("./routes/users/Login");
const planRoutes = require("./routes/users/Plan");
const pushRoutes = require("./routes/users/Push");
const reportRoutes = require("./routes/users/Report");
const SIDeviceRoutes = require("./routes/users/SIDevice");
const socketRoutes = require("./routes/users/Socket");
const ticketRoutes = require("./routes/users/Ticket");
const trackingRoutes = require("./routes/users/Tracking");
const userApiKeyRoutes = require("./routes/users/UserApiKey");
const userAppointmentRoutes = require("./routes/users/UserAppointment");
const userClassRoutes = require("./routes/users/UserClass");
const videosRoutes = require("./routes/users/Videos");
const waterRoutes = require("./routes/users/Water");
const weightRoutes = require("./routes/users/Weight");

//app initialization
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

//static file for css,js
app.use(express.static(path.join(rootDir, "public")));

app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({extended: true,}));
app.use(bodyParser.urlencoded({ limit: "2mb", extended: false }));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

//------------------------------------

//------------------------------------

//middleware

//Routes
app.use(homeRoutes);
app.use(usersRoutes);

//Expert routes
app.use(cronJobsRoutes);
app.use(resetPasswordRoutes);

//admin routes
app.use(appointmentRoutes);
app.use(baseApiRoutes);
app.use(blogCategoryRoutes);
app.use(blogRoutes);
app.use(botsRoutes);
app.use(categoryRoutes);
app.use(chartRoutes);
app.use(chatsRoutes);
app.use(classRoutes);
app.use(classesRoutes);
app.use(dashboardRoutes);
app.use(dealsRoutes);
app.use(employeeListRoutes);
app.use(eventRoutes);
app.use(expenseRoutes);
app.use(expertAuthRoutes);
app.use(expertDetailRoutes);
app.use(graphRoutes);
app.use(inventoryRoutes);
app.use(membershipRoutes);
app.use(personalTrainingRoutes);
app.use(photoTrackingRoutes);
app.use(POSRoutes);
app.use(programManagementRoutes);
app.use(purchaseRoutes);
app.use(supplierRoutes);
app.use(userListRoutes);
//users routes
app.use(articleRoutes);
app.use(basicRoutes);
app.use(botRoutes);
app.use(chatRoutes);
app.use(consultOnlineRoutes);
app.use(dashRoutes);
app.use(deviceRoutes);
app.use(diaryRoutes);
app.use(dietRoutes);
app.use(exerciseRoutes);
app.use(goalRoutes);
app.use(gymClassRoutes);
app.use(gymRoutes);
app.use(inquiryRoutes);
app.use(leadBotsRoutes);
app.use(listingRoutes);
app.use(loginRoutes);
app.use(planRoutes);
app.use(pushRoutes);
app.use(reportRoutes);
app.use(SIDeviceRoutes);
app.use(socketRoutes);
app.use(ticketRoutes);
app.use(trackingRoutes);
app.use(userApiKeyRoutes);
app.use(userAppointmentRoutes);
app.use(userClassRoutes);
app.use(videosRoutes);
app.use(waterRoutes);
app.use(weightRoutes);

//middleware-end

//server listening
app.listen(3000, () => {
  console.log("server started at port 3000");
});
