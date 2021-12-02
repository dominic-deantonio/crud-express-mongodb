
const express = require('express');
const bodyParser = require('body-parser')

const app = express();

const username = '';
const pword = '';
const dbId = '';

const connString = `mongodb+srv://${username}:${pword}@${dbId}`;
let db;
let quotesCollection;
const MongoClient = require('mongodb').MongoClient
MongoClient.connect(connString, { useUnifiedTopology: true },
    (err, client) => {
        if (err) return console.error(err);
        db = client.db('star-wars-quotes');
        console.log('Connected to Database: ' + db.databaseName);
        quotesCollection = db.collection('quotes');
    })

app.listen(3000, () => {
    console.log('listening on 3000');
});

app.set('view engine', 'ejs');

// Make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', async (req, res) => {
    const quotes = await quotesCollection.find().toArray();
    res.render('index.ejs', { quotes: quotes });
});

app.post('/quotes', async (req, res) => {
    console.log(req.body);
    const result = await quotesCollection.insert(req.body);
    console.log(result);
    res.redirect('/');
});

app.put('/quotes', (req, res) => {
    quotesCollection.findOneAndUpdate(
        { name: 'Yoda' },
        {
            $set: {
                name: req.body.name,
                quote: req.body.quote
            }
        },
        {
            upsert: true
        }
    ).then(result => { res.json('Success') }).catch(error => console.error(error))
})

app.delete('/quotes', (req, res) => {
    console.log(req.body.name);
    quotesCollection.deleteOne(
        { name: req.body.name }).then(result => {
            if (result.deletedCount === 0) {
                return res.json('No quote to delete')
            }
            return res.json(`Deleted Darth Vader's quote`);
        })
        .catch(error => console.error(error))
})
