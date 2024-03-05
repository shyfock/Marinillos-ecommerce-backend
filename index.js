require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const auth = require('./middleware/auth');
const initRoutes = require("./routes/index");
const userRoutes = require("./routes/UserRoutes");
const routes = require('./routes/ProductRoutes');
const path = require('path');

const app = express();

const PORT = process.env.PORT || "";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);
initRoutes(app);
userRoutes(app);
app.use('/files', express.static(path.join(__dirname, '/files')))

app.get('/message', (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.post('/welcome', auth, (req, res) => {
    res.status(200).send("Welcome!!!");
})

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`)
})

// Connection string from mongoDB.
const dbURI = process.env.ATLAS_URI || "";

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(function(result) {
        console.log('Database is connected');
    })
    .catch((err) => console.log(err));
