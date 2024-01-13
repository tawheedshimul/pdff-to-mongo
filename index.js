const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const multer = require('multer');
app.use("/files",express.static("files"))

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://phone:phone@cluster0.gro8ftq.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        //multer

        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './files');
            },
            filename: function (req, file, cb) {
                const uniqueSuffix = Date.now();
                cb(null, uniqueSuffix + file.originalname);
            },
        });

        const upload = multer({ storage: storage })

        app.post("/upload-files", upload.single("file"), async (req, res) => {
            try {
                const { title } = req.body;
        
                const db = client.db("TestPdfToMongodb");
                const collection = db.collection("PdfDetais");
        
                // Insert document into the collection
                const result = await collection.insertOne({
                    pdf: req.file.filename,
                    title: title,
                });
        
                console.log(`File inserted with _id: ${result.insertedId}`);
        
                res.send("File uploaded successfully");
            } catch (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
            }
        });

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Server is on')
})

app.listen(port, () => {
    console.log(`Server Connected SuccessFully ${port}`);
})