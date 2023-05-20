const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const toysCollection = database.collection("toys");

    //set route to get images for gallery
    app.get('/images',async(req, res)=>{
        const cursor = images.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    //set route to get data for category tabs
    app.get('/categories', async(req, res)=>{
        const cursor = category.find();
        const result = await cursor.toArray();
        res.send(result);
    })   
    
    //set route to get specific subcategory
    app.get('/categories/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await category.findOne(query);
        res.send(result);
    })

    //set route to get data for user reviews
    app.get('/reviews',async(req, res)=>{
        const cursor = reviews.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    
    //set route to get images for sponsors
    app.get('/sponsors',async(req, res)=>{
        const cursor = sponsors.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    //set route to add toy
    app.post('/toys', async(req, res)=>{
        const toys = req.body;
        const result = await toysCollection.insertOne(toys);
        res.send(result);
    })

    //set route to get data for all toys 
    app.get('/toys', async(req, res)=>{
        const cursor = toysCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    //set route to get data for specific toy
    app.get('/toys/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await toysCollection.findOne(query);
        res.send(result);
    })

    //view user added toys using filter
    app.get('/my-toys', async(req, res)=>{
        let query = {};
        if(req.query?.email){
            query = {email: req.query.email };
        }
        const cursor = toysCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    })

    //view user selected toy
    app.get('/my-toys/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await toysCollection.findOne(query);
        res.send(result);
    })
    //delete selected toys
    app.delete('/my-toys/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await toysCollection.deleteOne(query);
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

