const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const images = require('./data/images.json');
const categories = require('./data/categories.json');
const review = require('./data/review.json');

app.get('/', (req, res)=>{
    res.send("Hello Disney Toy server");
})
app.get('/images',(req, res)=>{
    res.send(images);
})
app.get('/categories',(req, res)=>{
    res.send(categories);
})
app.get('/review',(req, res)=>{
    res.send(review);
})
app.listen(port, ()=>{
    console.log(`server run successfully to ${port}`)
})

