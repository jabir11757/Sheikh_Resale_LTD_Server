const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yt0e1fj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const database = client.db('resellerUser');
        const productsCollection = database.collection('products');
        const addedProductCollection = database.collection('addedProduct');
        const bookingsCollection = database.collection('bookings');
        const usersCollection = database.collection('users');


        app.get('/products', async (req, res) => {
            const query = {};
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const products = await productsCollection.findOne(query);
            res.send(products);
        })

        app.get('/addedProducts', async (req, res) => {
            const query = {};
            const addedProducts = await addedProductCollection.find(query).toArray();
            res.send(addedProducts);
        })

        // app.get('/bookings', async (req, res) => {
        //     const query = {};
        //     const bookings = await bookingsCollection.find(query).toArray();
        //     res.send(bookings);
        // })

        app.get('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const booking = await bookingsCollection.findOne(query);
            res.send(booking)
        })

        app.get('/bookings', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await bookingsCollection.find(query).toArray();
            res.send(result)
        })

        app.post('/addedProducts', async (req, res) => {
            const product = req.body;
            const result = await addedProductCollection.insertOne(product);
            res.send(result);
        })

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
            res.send(result);
        })

        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '2h' })
                return res.send({ accessToken: token })
            }
            console.log(user);
            res.status(403).send({ accessToken: '' })
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(err => console.error(err))



app.get('/', (req, res) => {
    res.send('Reseller server is running.......')
})

app.listen(port, () => {
    console.log('Reseller server is running on port:', port)
})