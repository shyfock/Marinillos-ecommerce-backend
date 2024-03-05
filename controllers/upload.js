const upload = require("../middleware/upload");
const dbConfig = require("../config/db");
const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
const Image = require("../models/Images");
const Product = require("../models/Product");
// const FileReader = require("filereader");

const url = dbConfig.url;
const PORT = process.env.PORT;

const baseUrl = `http://localhost:${PORT}/files/`;

const mongoClient = new MongoClient(`${url}`);

const uploadFiles = async (req, res) => {
    try {
        await upload(req, res);
        console.log(req.files);
        let idList = [];
        req.files.forEach(img => {
            idList.push(img.id);
        })

        req.files.forEach(file => {
            let obj = {
                filename: file.filename,
                bucketName: file.bucketName,
                metadata: file.metadata,
                img: {
                    data: Buffer.from(file.filename),
                    contentType: 'img/png'
                }
            }
            Image.create(obj)
            .then((err, item) => {
                if (err) {
                    console.log(err);
                } else {
                    //item.save()
                    //res.redirect("/")
                    return
                }
            })
        })
        
        if (req.files.length <= 0) {
            return res
                .status(400)
                .send({
                    message: "You must select at list 1 file.",
                });
        }

        return res.status(200).send({
            message: "Files has been uploaded.",
            list: idList,
           // files: req.files
        });

        // Code To upload only one file
        // console.log(req.file)

        // if (req.file == undefined) {
        //     return res.send({
        //         message: "You must select a file.",
        //     });
        // }
        // return res.send({
        //     message: "File has been uploaded.",
        // });

    } catch (error) {
        console.log(error);

        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).send({
                message: "Too many files to upload.",
            });
        }
        return res.status(500).send({
            message: `Error when trying upload many files: ${error}`
        });

        // Code To upload only one file
        // return res.send({
        //     message: `Error when trying upload image: ${error}`,
        // });
    }
};

const getListFiles = async (req, res) => {
    try{
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const images = database.collection("images"); //database.collection(dbConfig.imgBucket + ".files");

        const cursor = images.find({});

        if ((await images.estimatedDocumentCount()) === 0) {
            return res.status(500).send({
                message: "No files found!",
            });
        }

        let fileInfos = [];
        await cursor.forEach((doc) => {
            fileInfos.push({
                name: doc.filename,
                url: baseUrl + doc.filename,
                productRef: doc.bucketName
            });
        });

        return res.status(200).send(fileInfos);
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};

const download = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const bucket = new GridFSBucket(database, {
            bucketName: dbConfig.imgBucket,
        });

        let downloadStream = bucket.openDownloadStreamByName(req.params.name);

        downloadStream.on("data", function (data) {
            return res.status(200).write(data);
        });

        downloadStream.on("error", function (err) {
            return res.status(404).send({ message: "Cannot download the Image!" });
        });

        downloadStream.on("end", () => {
            return res.end();
        });
        
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};

const addImages = async (req, res) => {
    try{
        const cursor = await Image.find({"metadata.productId": req.params.prodId});

        if ((cursor.length) === 0) {
            return res.status(500).send({
                message: "No se encontraron imágenes para este producto.",
            });
        }

        let fileInfos = [];
        cursor.forEach((doc) => {
            fileInfos.push({
                name: doc.filename,
                url: baseUrl + doc.filename,
            });
        });
        return res.status(200).send(fileInfos);
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};

module.exports = {
    uploadFiles,
    getListFiles,
    download,
    addImages,
};