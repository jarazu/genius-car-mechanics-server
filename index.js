const express = require('express');
const cors = require('cors');
const mongoObjId = require('mongodb').ObjectId
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// ************ mongo db  *************************
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v21cd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('carMechanics');
        const servicesCollection = database.collection('services');
        // get api
        app.get('/services', async(req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })

        // test hello
        app.get('/hello', (req, res) =>{
            res.send('hello updated here')
        })

        // get api by id
        app.get('/services/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: mongoObjId(id)}
            const srevice = await servicesCollection.findOne(query)
            res.json(srevice)
        })

        // post api
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            console.log('result', result)
            res.json(result)
        })

        // delete api
        app.delete('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id:mongoObjId(id)};
            console.log(id)
            const result = await servicesCollection.deleteOne(query);
            res.json(result)

        })
    }
    finally{
//
    }
}

run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send('Welcome!!!!');
})

app.listen(port, () => {
    console.log('server is running on port', port)
})