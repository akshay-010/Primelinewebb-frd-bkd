const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const dbconnection = require("./config/dbconfig");
dbconnection.dbconfig();
const adminRoutes = require("./Routes/adminRoutes");
const verifyToken =require("./Middleware/authMiddleware")

const cors = require("cors");

// Global middleware
app.use(express.json()); // For parsing JSON bodies
app.use(cors());
app.use("/uploads", express.static("uploads"));

// Routes for serving static HTML files
app.use('/assets', express.static(path.join(__dirname, 'frontend', 'assets')));

// Define the route to handle file uploads separately without using express.json()
app.use("/api/admin", adminRoutes);
// Attach middleware globally
app.get('/getLoginedUser', verifyToken, async (req, res) => {
  res.send(req.user);
});


// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'about.html'));
});
app.get('/adminLogin', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'AdminLogin.html'));
});
app.get('/admin-register', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'admin-register.html'));
});
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'admin-dashboard.html'));
});
app.get('/admin/client-review', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'CustomerMessage.html'));
});
app.get('/admin/add-brand', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'BrandUpload.html'));
});
app.get('/admin/add-cover-pick', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'CoverpicUpload.html'));
});
app.get('/admin/edit-cover-pick/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'edit-coverPic.html'));
});
app.get('/admin/update-brand/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'editBrand.html'));
});
app.get('/brand/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'brand.html'));
});
app.get('/admin/admin-brand-details/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'admin-brand-detail.html'));
});



// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server Is Running On http://localhost:${process.env.PORT}`);
});
