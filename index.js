const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion ,} = require('mongodb');
require('dotenv').config()

const port = process.env.PORT || 5000;




//middleware


app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "https://assingment-twelve.web.app",
        "https://assingment-twelve.firebaseapp.com"
      ],
      credentials: true,
    })
);
app.use(express.json());
// app.use(cors());
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
    const applyAllTrainerCollection = client.db('assingmentTwelve').collection('applayAllTrainer');
    const addForumPostCollection = client.db('assingmentTwelve').collection('forumpost');


 
    app.post('/jwt', async (req, res) => {
      const user = req.body;
      console.log('token', process.env.ACCESS_TOKEN_SECRET,user);
      const token =await jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })

    // middlewares 


    const verifyToken = (req, res, next) => {
      // console.log('inside verify token', req.headers.authorization);
      if (!req.headers.authorization) {
        return res.status(401).send({ message: 'unauthorized access' });
      }
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: 'unauthorized access' })
        }
        req.decoded = decoded;
        next();
      })
    }

    // use verify admin after verifyToken
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const user = await addUsersCollection.findOne(query);
      const isAdmin = user?.role === 'admin';
      if (!isAdmin) {
        return res.status(403).send({ message: 'forbidden access' });
      }
      next();
    }


    app.post('/users',verifyAdmin,verifyToken, async (req, res) => {
      const user = req.body
      // console.log( 'uswe' ,user)
      const query = { email: user.email }
      const existingUser = await addUsersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: 'user already exists', insertedId: null })
      }
      const result = await addUsersCollection.insertOne(user);
      res.send(result)
    });

 

   //trainer add
    app.post('/add', async (req, res) => {
      const trainer = req.body
      console.log( 'uswe' ,trainer)
      const result = await applyAllTrainerCollection.insertOne(trainer);
      res.send(result)
    });


    app.get(`/alltrainer` , async (req ,res ) => {
      // console.log(req.params)
      const result = await addAllTrainerCollection.find().toArray();
      res.send(result)

    })

    app.get(`/singletrainer` , async (req ,res ) => {
      const trainer = req.body
      // console.log(trainer)
      // const qurary ={_id: new ObjectId(_id)}
      const result = await addAllTrainerCollection.findOne();
      res.send(result)

    })


    app.get(`/users/:email` , async (req ,res ) => {
      // console.log(req.params)
      const qurary ={email:req.params.email}
      const result = await addUsersCollection.findOne(qurary);
      res.send(result)

    })


    app.post('/forumpost', async (req, res) => {
      const post = req.body
      console.log( 'uswe' ,port)
      const result = await addForumPostCollection.insertOne(port);
      res.send(result)
    });

    app.delete('/user/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: new ObjectId(id) }
      const result = await addAllTrainerCollection.deleteOne(query);
      res.send(result);
    })

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