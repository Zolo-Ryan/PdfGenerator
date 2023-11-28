const fs = require("fs-extra");
const User = require("../models/user");
const Confirm = require("../models/confirm-user");
const puppeteer = require("puppeteer");
const hbs = require("handlebars");
require("dotenv").config();
const router = require("express").Router();
const {upload} = require("../utils/multerUtil");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,"./uploads/paymentSS");
    },
    filename: (req,file,cb) => {
        cb(null,`${Date.now()}-${file.originalname}`);
    }
});
const upload2 = multer({storage});

const { google } = require("googleapis");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

const path = require("path");
//function to compile the template html into the pdf by giving it the data
const compile = async function(templateName,data){
  const filePath = path.resolve("./utils/"+`${templateName}.hbs`);
  const html = await fs.readFile(filePath,"utf-8");
  return hbs.compile(html)(data,{
    allowProtoPropertiesByDefault: true
  });
}

router.route("/:leaderID").post(upload.single("photo"), async (req, res) => {
  const leaderID = req.params.leaderID;
  let leader = await User.findById({ _id: leaderID });

  const { file, body } = req;
  const { username, contact, plan, gender } = body;
  if (username !== "" && contact !== "" && file !== undefined) {
    const prevMember = await User.findOne({ username, contact, leaderID });
    if (!prevMember) {
      const member = await User.create({
        leaderID,
        username,
        teamName: leader.teamName,
        college: leader.college,
        contact,
        plan,
        gender,
        event: leader.event,
        date: leader.date,
        time: leader.time,
        photo: file.filename,
      });
      leader = await User.findByIdAndUpdate(
        { _id: leaderID },
        {
          $push: {
            membersID: {
              member: member._id,
              plan: member.plan,
            },
          },
        },
        { new: true }
      );
    }
  }
  let totalPrice = stringToPrice(leader.plan);
  const members = leader.membersID;
  members.forEach((member) => {
    totalPrice += stringToPrice(member.plan);
  });
  return res.render("price-page", {
    amount: totalPrice,
    leaderID,
  });
});

router
  .route("/confirmation/:leaderID")
  .post(upload2.single("photo"), async (req, res) => {
    const { file } = req;
    const leaderID = req.params.leaderID;
    const confirm = await Confirm.create({
      leader: leaderID,
      photo: file.filename,
    });
    const leader = await User.findOne({ _id: leaderID });
    const array = await User.find({ leaderID });
    array.push(leader);
    
    (async function(){
      try {
        array.forEach( async (e) => {
          const browser = await puppeteer.launch({
            args: [
              "--disable-setuid-sandbox",
              "--no-sandbox",
              "--single-process",
              "--no-zygote",
            ],
            executablePath: process.env.NODE_ENV === "production" ?  process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath() ,
          });
          const page = await browser.newPage();
          const content = await compile("finalTemplate",{data: e});
          await page.setContent(content);
          const pathF =  `./teams/${leader.teamName}-${Date.now()}-${e.username}.pdf`;
          await page.pdf({
            path: pathF,
            format: "A3",
            printBackground: true
          });
          await uploadFile(pathF,leader,e);
          await browser.close();
        });

        console.log("A team has registered: ",leader.teamName);
      } catch (error) {
        console.log(error);
      }
    })();
    
    return res.render("thank-you");
  });

function stringToPrice(string) {
  if (string === "STARNIGHT") return 550;
  if (string === "STAY") return 150;
  return 0;
}
async function uploadFile(filePath, leader, e) {
  try {
    const res = await drive.files.create({
      requestBody: {
        name: `${leader.teamName}-${e.username}`,
        mimeType: "application/pdf",
      },
      media: {
        mimeType: "application/pdf",
        body: fs.createReadStream(filePath),
      },
    });
    console.log(res.data);
  } catch (error) {}
}
module.exports = router;
