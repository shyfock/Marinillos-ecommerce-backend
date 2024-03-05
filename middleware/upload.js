const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const dbConfig = require("../config/db");

var storage = new GridFsStorage({
    url: dbConfig.url + dbConfig.database,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg"];
        const prodRef = req.params.prodId;
        const fileName = file.originalname.split(" ").join("-")
        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-CHMP-${fileName}`;
            return filename;
        }

        return {
            bucketName: dbConfig.imgBucket,
            filename: `${Date.now()}-CHMP-${fileName}`,
            metadata: {productId: prodRef}
        };
    },
});

// var uploadFiles = multer({ storage: storage }).single("file");
var uploadFiles = multer({ storage: storage }).array("file", 10)
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;