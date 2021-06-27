const express = require('express');
const port = 5000;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
var cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express()

// Middle wares 

app.use(cors())
app.use(bodyParser.json());
app.use(express.static('doctors'));

const uri = "mongodb+srv://nfashion:nfashion360@cluster0.snl1n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const postCollection = client.db("nfashion").collection("posts");
  const adminCollection = client.db("nfashion").collection("admins");
  const subsriberCollection = client.db("nfashion").collection("subscribers");
  // perform actions on the collection object

  app.post('/uploadPost', (req, res) => {
    const newPost = req.body;
    console.log(newPost);
    postCollection.insertOne(newPost)
      .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount > 0)
      })

  });

  app.get('/posts', (req, res) => {
    postCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  });

  // Delete Data 

  app.delete('/deletePost',(req,res)=>{
    postCollection.deleteOne(
      { "email":"My title2" } // specifies the document to delete
  ).then(
    result =>{
      console.log(result.deleteCount);
      res.send(result.deletedCount > 0);
    }
  ).catch(error => {
    console.log(error);
  })
  })

  // Add Admin 

  app.post('/addAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.insertOne({email })
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  // Identify Admin 

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
        .toArray((err, doctors) => {
            res.send(doctors.length > 0);
        })
})


});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})