const express=require('express');
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
const app=express();
const cors=require('cors');
require('dotenv').config()

const port=5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fxxgq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();

      const database = client.db('carmechanics');
      const dbCollection = database.collection('mechanics');
      console.log('connect to db');


    //load api

    app.get('/services',async(req,res)=>{
        const cursor=dbCollection.find({});
        const result= await cursor.toArray();
        res.send(result);

    });

    //load selected api

    app.get('/services/:id',async(req,res)=>{
        const id=req.params.id;
        const quary={_id:ObjectId(id)};
        const result=await dbCollection.findOne(quary);
        res.send(result);

    })


    // post api
    app.post('/services',async(req,res)=>{
        const addService=req.body;
        const result=await dbCollection.insertOne(addService);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);

        res.json(result);
        

    });


    //delete api
    app.delete('/services/:id',async(req,res)=>{
        const id=req.params.id;
        const quary={_id:ObjectId(id)};
        const result=await dbCollection.deleteOne(quary);
        res.send(result);
    });

    // update api

    app.put('/services/:id',async(req,res)=>{
        const id=req.params.id;
        const updated=req.body;
        const filter={_id:ObjectId(id)};
        const options = { upsert: true };
        const updateDoc = {
            $set: {
              name:updated.name,
              price:updated.price,
              description:updated.description,
              img:updated.img,
            },
          };
          const result = await dbCollection.updateOne(filter, updateDoc, options);
          res.json(result);

    });

    } finally {

    //    await client.close();
   
}
  }
  run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('data sent..');
});

app.listen(port,(req,res)=>{
    console.log('connect to port: ',port);

});