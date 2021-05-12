require('dotenv').config()
const express = require('express');
const app = express();
const port = 80;
app.listen(port, () => console.log(`sample-app listening on port ${port}!`));


const Sequelize = require('sequelize');
const sequelize = new Sequelize('node_sample_db', process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: 5432,
    logging: console.log,
    maxConcurrentQueries: 100,
    dialect: 'postgres',
    pool: { maxConnections: 5, maxIdleTime: 30},
    language: 'en'
})


sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
  
const Note = sequelize.define('notes', { note: Sequelize.TEXT, tag: Sequelize.STRING });

sequelize.sync()
  .then(() => {
    console.log(`Database & tables created!`);
    
    return Note.findAll()
    .then(function(notes) {
      console.log(notes);
        if (notes.length == 0){
            Note.bulkCreate([
              { note: 'pick up some bread after work', tag: 'shopping' },
              { note: 'remember to write up meeting notes', tag: 'work' },
              { note: 'learn how to use node orm', tag: 'work' }
            ]);
        }
    });
  });
  
  
  
app.get('/', (req, res) => res.send('Sample App'));
app.get('/healthcheck', function(req, res) {
    
    Note.findAll()
        .then( notes => {
            res.status( 200 ).json( notes )
        })
        .catch( error => {
            res.status( 500 ).json( error )
        })
});




