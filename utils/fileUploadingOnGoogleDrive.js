const fs = require("fs-extra");
const { google } = require("googleapis");
require("dotenv").config();

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
    // console.log(res.data); kind,id,name,mimeType
    const urls = await publicURL(res.data.id);
    return urls;
  } catch (error) {
    console.log(error);
  }
}
async function publicURL(fileId) {
  try {
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    const result = await drive.files.get({
      fileId,
      fields: "webViewLink, webContentLink",
    });
    // console.log(result.data); both fields only
    return result.data;
  } catch (error) {}
}

module.exports = {
    uploadFile,publicURL
};