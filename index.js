const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g9rirok.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const toDoCollection = client.db("taskDB").collection("toDo");
    const userCollection = client.db("taskDB").collection("users");

    // all to do list
    app.get('/toDo', async (req, res) => {
        const result = await toDoCollection.find().toArray();
        res.send(result)
    })
    // all to do list

    // add task
    app.post('/toDo', async (req, res) => {
        const item = req.body;
        const result = await toDoCollection.insertOne(item);
        res.send(result)
    })
    // delete task
    app.delete('/toDo/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await toDoCollection.deleteOne(query);
        res.send(result)
    })
    // delete task
    // add task

     // update task api
     app.patch('/toDo/:id', async (req, res) => {
        const item = req.body;
        const id = req.params.id;
        const filter =  { _id: new ObjectId(id) };
        const updatedDoc ={
            $set: {
                title: item.title,               
                deadline: item.deadline,
                description: item.description,
                
            }
        }
        const result =await toDoCollection.updateOne(filter, updatedDoc);
        res.send(result)
    })
    // update task api

    app.get('/toDo/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };

        const options = {
            projection: {
                title: 1, description: 1, deadline: 1, 
            },
        };
        const result = await toDoCollection.findOne(query, options);
        // console.log(216,query, result);
        res.send(result);
    })


    // user related api
    app.post('/users', async (req, res) => {
        const user = req.body;

        const query = { email: user.email };
        const existingUser = await userCollection.findOne(query)

        if (existingUser) {
            return res.send({ message: 'user already exist', insertedId: null })
        }

        const result = await userCollection.insertOne(user);
        res.send(result)
    });
    // user related api
   



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);












app.get('/', (req, res) => {
    res.send('task manager is running ')
})

app.listen(port, () => {
    console.log(`task manager is running on port ${port}`);
})