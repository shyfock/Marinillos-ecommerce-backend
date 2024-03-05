require("dotenv").config();

const URL = process.env.ATLAS_URI_2 || "";

module.exports = {
    url: URL,
    database: "marinillos",
    imgBucket: "photos",
};