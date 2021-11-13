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
        const exploreCollection = database.collection('explores');
        const purchaseCollection = database.collection('purchase')
        const usersCollection = database.collection('users')
        const reviewsCollection = database.collection('reviews')

        
        
        
        // Get Products Api

        app.get('/explores', async(req, res) =>{
            const cursor = exploreCollection.find({});
            const explores = await cursor.toArray();
            res.send(explores);
        });

       
        app.get('/explores/:id', async(req, res) => {
            const id = req.params.id
            // console.log("getting single id", id);
            const query = {_id: ObjectId(id)}
            const explore = await exploreCollection.findOne(query);
            res.json(explore);
        });


        app.get('/purchase', async (req, res) =>{
            const email = req.query.email;
            const query = {email : email}
            const cursor = purchaseCollection.find(query)
            const orders = await cursor.toArray();
            res.json(orders);
        });

                app.post('/purchase', async (req, res) => {
                const carPurchase = req.body;
                const result = await purchaseCollection.insertOne(carPurchase);
                // console.log(result);
                res.json(result);
            });


            app.get('/users/:email', async (req, res)=>{
                const email = req.params.email;
                const query = { email : email };
                const user = await usersCollection.findOne(query);
                let isAdmin = false;
                if(user?.role === 'admin'){
                    isAdmin = true;
                }
                res.json({admin : isAdmin});
            })


            app.post('/users', async (req, res) =>{
                const user = req.body;
                const result = await usersCollection.insertOne(user);
                console.log(result);
                res.json(result);
            });

            app.put('/users', async(req, res)=> {
                const user = req.body;
                const filter = {email: user.email};
                const options = {upsert: true};
                const updateDoc = {$set: user};
                const result = await usersCollection.updateOne(filter, updateDoc, options);
                res.json(result);
            });

            app.put('/users/admin', async(req, res)=>{
                const user = req.body;
                console.log('put', user);
                const filter = {email: user.email};
                const updateDoc = {$set: {role : 'admin'}}
                const result = await usersCollection.updateOne(filter, updateDoc)
                res.json(result);
            });

            //Delete API request
            app.delete('/purchase/:id', async (req, res) =>{
                const id = req.params.id;
                const query = {_id: ObjectId(id)};
                const result = await purchaseCollection.deleteOne(query);
                console.log(result);
                res.json(result);
            });

            app.post('/addexplores', async (req, res) => {
                const addExplores = req.body;
                const result = await exploreCollection.insertOne(addExplores);
                // console.log(result);
                res.json(result)
            });

            app.get('/reviews', async(req, res) =>{
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        }) 

        app.post('/addreviews', async (req, res) => {
            const addReviews = req.body;
            const result = await reviewsCollection.insertOne(addReviews);
            // console.log(result);
            res.json(result)
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