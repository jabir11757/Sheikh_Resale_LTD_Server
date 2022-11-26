const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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