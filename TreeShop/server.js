require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const methodOverride = require("method-override");
const Tree = require("./models/Tree");

const app = express();
const PORT = 3000;

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Kết nối MongoDB Atlas thành công!"))
    .catch(err => console.log("❌ Lỗi kết nối MongoDB:", err));

// Cấu hình EJS và thư mục public
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Cấu hình Multer để upload ảnh
const storage = multer.diskStorage({
    destination: "./public/images",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// Trang chủ - Hiển thị danh sách cây
app.get("/", async (req, res) => {
    const trees = await Tree.find();
    res.render("index", { trees, error: req.query.error });
});

// Thêm cây mới
app.post("/add", upload.single("image"), async (req, res) => {
    if (!req.body.treename || !req.body.description) {
        return res.redirect("/?error=missing_fields");
    }
    const newTree = new Tree({
        treename: req.body.treename,
        description: req.body.description,
        image: req.file ? `/images/${req.file.filename}` : "/images/default.jpg",
    });
    await newTree.save();
    res.redirect("/");
});

// Xóa tất cả dữ liệu (Reset)
app.post("/reset", async (req, res) => {
    await Tree.deleteMany({});
    res.redirect("/");
});

// Trang "About Me"
app.get("/about", (req, res) => {
    res.render("about");
});

// Khởi chạy server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
