const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json());

//DB settings

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kaasp8g.mongodb.net/?retryWrites=true&w=majority`;

//using offline uri
// const uri = "mongodb://localhost:27017"

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
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();

    const database = client.db("disney-toys");
    const images = database.collection("images");
    const reviews = database.collection("reviews");
    const sponsors = database.collection("sponsors");
    const category = database.collection("category");

    app.get('/images',async(req, res)=>{
        const cursor = images.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/categories', async(req, res)=>{
        const cursor = category.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/reviews',async(req, res)=>{
        const cursor = reviews.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    
    app.get('/sponsors',async(req, res)=>{
        const cursor = sponsors.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send("Hello Disney Toy server");
})

app.listen(port, ()=>{
    console.log(`server run successfully to ${port}`)
})

