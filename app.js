const express = require("express");
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");

// Set storage Engine
const storage = multer.diskStorage({
	destination: "./public/uploads/",
	filename: (req, file, cb) => {
		console.log("cb")
		cb(null, file.fieldname + "-" + Date.now() 
			+ path.extname(file.originalname));
	}
});

const upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
			checkFileType(file, cb);
		}
	/*limit: {fileSize: 10 -> bytes}*/
}).single("myImage");

function checkFileType(file, cb) {
	//Allowed extensions
	const filetypes = /jpeg|jpg|png|gif/;
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	//check mime
	const mimetype = filetypes.test(file.mimetype);

	if(mimetype && extname) {
		return cb(null, true);
	}else {
		cb("Error: Images only!");
	}Error
}

const app = express();

app.set("view engine", "ejs");

app.use(express.static("./public"));

app.get("/", (req, res) => res.render("index"));
app.post("/upload", (req, res) => {
	upload(req, res, (err) => {
		if(err) {
			res.render("index", {
				msg: err
			});
		}else {
			if(req.file == undefined) {
				res.render("index", {
				msg: "Error not file selected!"
			});
			}else {
				res.render("index", {
				msg: "File uploaded!",
				file: `uploads/${req.file.filename}`
			});
			}
		}
	});
});

app.set("port", process.env.PORT || 8080);
app.listen(app.get("port"), () => {
	console.log(`Listening on port: ${app.get("port")}`);
});