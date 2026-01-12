require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Routes
const authRoutes = require("./routes/auth-routes/index");
const mediaRoutes = require("./routes/instructor-routes/media-routes");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
const studentViewCourseRoutes = require("./routes/student-routes/course-routes");
const studentViewOrderRoutes = require("./routes/student-routes/order-routes");
const studentCoursesRoutes = require("./routes/student-routes/student-courses-routes");
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Allow large uploads
app.use(express.json({ limit: "1gb" }));
app.use(express.urlencoded({ limit: "1gb", extended: true }));


// CORS configuration - allow multiple origins for production
const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(',').map(url => url.trim())
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


// MongoDB connection with timeout
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in environment variables");
  console.error("Please create a .env file with MONGO_URI=your_mongodb_connection_string");
} else {
  console.log("Attempting to connect to MongoDB...");
  mongoose
    .connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s
      // Add these options for better connection handling
      retryWrites: true,
      w: 'majority',
    })
    .then(() => {
      console.log("✅ MongoDB connected successfully");
      console.log("Database:", mongoose.connection.name);
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
      
      // Provide specific help based on error type
      if (err.message.includes('ENOTFOUND') || err.message.includes('querySrv')) {
        console.error("\n🔍 DNS Resolution Error - This usually means:");
        console.error("1. Check your internet connection");
        console.error("2. Verify the MongoDB Atlas cluster is active (not paused)");
        console.error("3. Check if your connection string format is correct:");
        console.error("   Should be: mongodb+srv://username:password@cluster.mongodb.net/dbname");
        console.error("4. Try using the standard connection string instead of SRV:");
        console.error("   Replace 'mongodb+srv://' with 'mongodb://' and use port 27017");
        console.error("5. Check if your IP is whitelisted in MongoDB Atlas Network Access");
      } else if (err.message.includes('authentication failed')) {
        console.error("\n🔍 Authentication Error:");
        console.error("1. Check your username and password in the connection string");
        console.error("2. Verify the database user exists in MongoDB Atlas");
      } else {
        console.error("\nPlease check:");
        console.error("1. MongoDB Atlas cluster is running (not paused)");
        console.error("2. MONGO_URI is correct in .env file");
        console.error("3. Your IP address is whitelisted in MongoDB Atlas Network Access");
        console.error("4. Network/firewall allows connection");
      }
      
      console.error("\nServer will continue but database operations will fail");
    });
}

// Routes
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", studentViewCourseRoutes);
app.use("/student/order", studentViewOrderRoutes);
app.use("/student/courses-bought", studentCoursesRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);

app.get("/", (req, res) => {
  res.send("PrepMate API is running");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(" Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
