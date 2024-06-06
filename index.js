const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const port = process.env.PORT || 5000;




//middleware
// app.use(cors());

app.use(
    cors({
      origin: [
        "http://localhost:5173",
      ],
      credentials: true,
    })
);
app.use(express.json());

// console.log( 'name',process.env.NAME_DB)


// const uri ="mongodb://localhost:27017"
const uri = `mongodb+srv://${process.env.NAME_DB}:${process.env.PASS_DB}@cluster0.j44byal.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    // await client.connect();

    const addUsersCollection = client.db('assingmentTwelve').collection('users');
    const addAllTrainerCollection = client.db('assingmentTwelve').collection('addAllTrainer');


    app.post('/users', async (req, res) => {
      const user = req.body
      console.log( 'uswe' ,user)
      // insert email if user doesnt exists: 
      // you can do this many ways (1. email unique, 2. upsert 3. simple checking)
      const query = { email: user.email }
      const existingUser = await addUsersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: 'user already exists', insertedId: null })
      }
      const result = await addUsersCollection.insertOne(user);
      res.send(result)
    });



    // Connect the client to the server	(optional starting in v4.7)
   
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
};
run().catch(console.dir);





app.get('/',(req,res) => {
    res.send('twelve assignment server is runnig')

})

app.listen(port,() => {
    console.log(`twelve server is running on port : ${port}`)
})