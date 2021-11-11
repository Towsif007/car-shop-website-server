const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.luh2o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('carProducts')
        // const productCollection = database.collection('products');
        const exploreCollection = database.collection('explores');

        
        // app.get('/products', async(req, res) =>{
        //     const cursor = productCollection.find({});
        //     const products = await cursor.toArray();
        //     res.send(products);
        // }) 
        
        // Get Products Api

        app.get('/explores', async(req, res) =>{
            const cursor = exploreCollection.find({});
            const explores = await cursor.toArray();
            res.send(explores);
        });

        // Get Single Car 
        app.get('/explores/:id', async(req, res) => {
            const id = req.params.id;
            // console.log("getting single id", id);
            const query = {_id: ObjectId(id)}
            const explore = await exploreCollection.findOne(query);
            res.json(explore);
        });






    }
    finally{
        // await client.close();
    }
}


run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running My Crud Server');
})

app.listen(port, () =>{
    console.log('Running Server On Port', port);
})