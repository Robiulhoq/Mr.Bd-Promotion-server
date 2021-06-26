const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const port = 5001
app.use(bodyParser.json())
app.use(cors());


require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tx9ov.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("mrbdpromotion").collection("products");
  const addToCartCollection = client.db("mrbdpromotion").collection("addToCart")
  const odderCollection = client.db("mrbdpromotion").collection("odder")
  console.log("dababase connect");
  // created for fast time data add
  app.post('/addProduct', (req, res) => {
    const product = req.body;
    productCollection.insertOne(product)
      .then(result => {
        res.send(result)
      })

  })
  app.get('/allProduct', (req, res) =>{
    productCollection.find({})
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })
  app.post('/addToCard', (req, res) => {
    const cart = req.body;
    addToCartCollection.insertOne(cart)
      .then(result => {
        res.send(result)
      })
  })

  app.post('/cartItem', (req, res) => {
    const { odderEmail } = req.body;
    // console.log(email);
    addToCartCollection.find({loginEmail: odderEmail})
    .toArray((err, document) =>{
     res.send(document)
    })

  })

  app.post('/odderPlace',(req, res) =>{
    const odderInfo = req.body;
    console.log(odderInfo);
    odderCollection.insertOne(odderInfo)
    .then(result =>{
      res.send(result)
    })
  })
  
  app.get('/allOdderItem', (req, res) =>{
    odderCollection.find({})
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })

  app.post('/deleteOdder', (req, res) =>{
    const {productId} = req.body;
    console.log(productId);
   addToCartCollection.deleteOne({productId: productId})
   .then(result =>{
     res.send(result)
   })
    
  })

});
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})