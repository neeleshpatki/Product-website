const express = require("express");
const mongoose = require("mongoose");
const db = require("./database/db.js");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const upload = multer({ dest: "uploads/" });


//----------------------------------------------------------------
const twilio = require("twilio");  
const TWILIO_ACCOUNT_SID="env.AC9a7c12613dd42914a371b7bc9c745fdb";
const TWILIO_AUTH_TOKEN="20fb02228db99c07d5a470e07339bb6e";


const accountSid = process.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);



//--------------------
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "saurabhgayke45@gmail.com",
        pass: "jops ccaq mhva hnwu",
    },
});

db();

const Schema = mongoose.Schema;

// User Schema
const userschema = new Schema({
    name: String,
    email: String,
    mobile: Number,
});
const usermodel = mongoose.model("newusers", userschema);

// Product Schema
const productschema = new Schema({
    name: String,
    price: Number,
    discount:  Number,
    image: String, 
});
const productmodel = mongoose.model("products", productschema);

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.set("view engine", "ejs"); // To render EJS templates
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded images


app.get("/add", (req, res) => {
    res.render("adduser.ejs");
});

app.get("/addpro", (req, res) => {
    res.render("addproduct.ejs");
});

app.get("/show", async (req, res) => {
    try {
        const users = await usermodel.find();
        res.render("showuser.ejs", { data: users });
    } catch (err) {
        res.send(err.message);
    }
});

app.get("/showpro", async (req, res) => {
    try {
        const products = await productmodel.find();
        res.render("showproduct.ejs", { data: products });
    } catch (err) {
        res.send(err.message);
    }
});

// Add User Action
app.post("/useraction", async (req, res) => {
    try {
        const record = new usermodel(req.body);
        await record.save();
        main(req.body.email);
        await createMessage(req.body.phone);
        res.redirect("/show");
    } catch (err) {
        res.send(err.message);
    }
});

// Add Product Action
app.post("/productaction", upload.single("image"), async (req, res) => {
    try {
        const { name, price, discount } = req.body;
        const image = req.file.filename; 
        const product = new productmodel({ name, price,discount, image });
        await product.save();
        res.redirect("/showpro");
    } catch (err) {
        res.send(err.message);
    }
});

async function main(emailid) {
    const info = await transporter.sendMail({
        from: "<saurabhgayke45@gmail.com>",
        to: emailid,
        subject: "Js Application",
        text: "Hello world?",
        html: "<b>Hello world?</b>",
    });

    console.log("Message sent: %s", info.messageId);
}


async function createMessage(phone) {
    try {
        const message = await client.messages.create({
            body: "This is the ship that made the Kessel Run in fourteen parsecs?",
            from: `+917387508290`, // Replace with your Twilio number
            to: `+91${phone}`,  // Make sure to prepend the correct country code
        });
        console.log(message.body);
    } catch (err) {
        console.error("Error sending SMS:", err.message);
    }
}




app.listen(9100);
