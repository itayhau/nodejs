const express = require('express')
const router = express.Router();
const path = require('path')
const url = require("url")
const cors = require("cors");
const sqlite3 = require('sqlite3').verbose();
//const db1 = require("..express1/first.db")

const knex = require("knex"); 
const { type } = require('os');
const connectedKnex = knex({
  client: "sqlite3",
  connection: {
    filename:"first.db"
  }
})

const port = 8080

const app = express();
app.use(express.static(path.join(__dirname, '/')))
// localhost:8080/page1.html

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.get('/', (req, resp) => 
{
    resp.writeHead(200);
    resp.end('this page will be sent on default url')
})
app.get('/fruit', (req, resp) => 
{
    resp.writeHead(201);
    resp.end('banana is my favorite fruit')
})

app.get('/p1', (req, resp) => 
{
    resp.sendFile(path.join(__dirname + '/page1.html'));
});

app.get('/random3', (req, resp) => 
{
    resp.writeHead(200);
    resp.end(`random number = ${Math.random() * 100}`)
})

app.get('/add', (req, resp) => {
    console.log(req.url)
    console.log(req.query)
    if (isNaN(Number(req.query.a))) {
        resp.writeHead(400);
        resp.end(`${req.query.a} is not a number!`);
        return;
    }
    if (isNaN(Number(req.query.b))) {
        resp.writeHead(400);
        resp.end(`${req.query.b} is not a number!`);
        return;
    }    
    const a = Number(req.query.a)
    const b = Number(req.query.b)
    const sum = a + b
    resp.writeHead(200);
    resp.end(`${a} + ${b} = ${sum}`)
})

app.get('/customer/:cust_id', (req, resp) => 
{
    resp.writeHead(200);
    resp.end(`you sent ${req.params.cust_id}`)
})

let db = new sqlite3.Database('first.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the first database.');
});

app.get("/books", async (req, res) => {
  const result = await connectedKnex("company").select("*")
  res.status(200).json({ result})
});

app.post("/books", async (req, res) => {
  try
  {
  const result = await connectedKnex("company").insert(req.body)
  res.status(201).json({res: "success"})
  }
  catch(e) {
    res.send( {
      status: 'fail',
      message: e.message
    });
  }
});

app.get('/company_conn', (req, resp) => 
{
// connecting to the db
let db = new sqlite3.Database('first.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the first database.');
  });

// fire select quiey
res1 = []
db.serialize(() => {
    db.each(`SELECT * FROM COMPANY`, (err, row) => {
      if (err) {
        console.error(err.message);
      }
      console.log(row);
      res1.push(row)
    });
  });  

  // close connector
db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
  }); 
  console.log('==========')
  console.log(res1)
  return res1;
})


app.listen(port, () => console.log(`Listening to port ${port}`))

// not get to here
