const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId, Admin } = require('mongodb');

//middleware
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dhrn8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
    
    client.connect();
    const menuCollection = client.db("chickenDb").collection("menu");
    const cartCollection = client.db("chickenDb").collection("carts");

   app.get("/menu", async(req, res) => {
    const result = await menuCollection.find().toArray();
    res.send(result)
   })
  //  carts api

  app.get('/carts', async (req, res) => {
    const query = {};  // This allows fetching all items in the collection
    const result = await cartCollection.find(query).toArray();
    res.send(result);
  });

   app.post('/carts', async(req, res) => {
    const item = req.body;
    console.log(item);
    const result = await cartCollection.insertOne(item);
    res.send(result);
   })

   app.delete('/carts/:id', async(req,res)=>{
    const id = req.params.id;
    const query = { _id: new ObjectId(id)};
    const result = await cartCollection.deleteOne(query);
    res.send(result);
   })
   
   app.put('/carts/:id', async (req, res) => {
    const id = req.params.id;
    const { quantity } = req.body; // Get quantity from the request body
    const query = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: { quantity: quantity }, // Update the quantity
    };
    
    const result = await cartCollection.updateOne(query, updateDoc);
    res.send(result);
  });


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
