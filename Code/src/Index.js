const express = require('express');
const app = express();
var path = require('path');
const bodyParser = require("body-parser");
const {Pool} = require('pg');
const querystring = require('querystring');

const fs = require('fs');
const https = require('https');
const { auth, requiresAuth } = require('express-openid-connect'); 
const dotenv = require('dotenv');
dotenv.config();


var staticPath = path.join(__dirname, 'static');
app.use(express.static(staticPath));

app.set('static', path.join(__dirname, 'static'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('static'));

function QueryStringToJSON(location) {            
  var pairs = location.split('&');
  
  var result = {};
  pairs.forEach(function(pair) {
      pair = pair.split('=');
      result[pair[0]] = decodeURIComponent(pair[1] || '');
  });

  return JSON.parse(JSON.stringify(result));
}

const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = 4080;


const config = { 
  authRequired : false,
  idpLogout : true, //login not only from the app, but also from identity provider
  secret: process.env.SECRET,
  baseURL:  externalUrl || `https://localhost:${port}`,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: 'https://dev-k7agtw8lpentcvyy.eu.auth0.com',
  clientSecret: process.env.CLIENT_SECRET,
  authorizationParams: {
    response_type: 'code' ,
    //scope: "openid profile email"   
   },
};
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config))


const pool = new Pool({
    connectionString: 'postgres://databaseapipg14_user:GAvky1gwOzxtytOQB4rTiKxmUcKsOFIq@dpg-cdp8fsen6mpuqruhl390-a.oregon-postgres.render.com/databaseapipg14',
    user:"databaseapipg14_user",
    host: "dpg-cdp8fsen6mpuqruhl390-a",
    database: 'databaseapipg14',
    password: "GAvky1gwOzxtytOQB4rTiKxmUcKsOFIq",
    port: 5432,
    ssl: true
    
    })

async function getDbSave( arg) {

  const movie_name = [];
  const direcetor  = [];
  const genre  = [];

 

  
  argToUse = 'SELECT movie_id, movie_name, direcetor, genre, stars, rating, imdb_ranking, awards, movie_year, movie_length  from movies'
  



  console.log(argToUse)


  let results = await pool.query(argToUse);

  var IDs = []
  var StringCheck = ""

  if(arg != undefined){

   

    results.rows.forEach(r => {

      StringCheck = ((r["movie_name"]) + (r["direcetor"])+(r["movie_id"])+(r["genre"])+(r["stars"])+(r["rating"])+(r["imdb_ranking"])+ (r["awards"])+(r["movie_year"])+(r["movie_length"]))

      if (StringCheck.includes(arg)){
        IDs.push((r["movie_id"]))
      }

    });

  }

  
  console.log("Database resposne ")
  console.log( results)

/*
  results.rows.forEach(r => {
    movie_name.push(r["movie_name"]);
    direcetor.push(r["direcetor"]);
    genre.push(r["genre"]);
  });
*/
  
var dataRet = []

results.rows.forEach(r => {

  if ( ( arg == undefined ) || (arg != undefined && (r["movie_id"]) in IDs)){

      dataRet.push(
        {
        "movie_name": (r["movie_name"]),
        "direcetor" : (r["direcetor"]),
        "movie_id" : (r["movie_id"]),
        "genre" : (r["genre"]),
        "stars" : (r["stars"]),
        "rating" : (r["rating"]),
        "imdb_ranking" : (r["imdb_ranking"]),
        "awards" : (r["awards"]),
        "movie_year" : (r["movie_year"]),
        "movie_length" : (r["movie_length"])
        }
      )

  }


});
  
  
  return JSON.stringify({"data" : dataRet})

  //return ({"data" : dataRet}) / dataRet
  //return [movie_name,direcetor,genre];
 
}


async function getDbID( arg) {

  const movie_name = [];
  const direcetor  = [];
  const genre  = [];

 

  
  argToUse = 'SELECT movie_id, movie_name, direcetor, genre, stars, rating, imdb_ranking, awards, movie_year, movie_length  from movies';
  
  //argAppend = ' WHERE movie_id = ' + '"' + arg + '"';
  argAppend = ' WHERE movie_id = ' + arg ;

  argToUse = argToUse + argAppend

  console.log(argToUse)


  let results = await pool.query(argToUse);

  console.log(results)
  
var dataRet = []

results.rows.forEach(r => {
      dataRet.push(
        {
        "movie_name": (r["movie_name"]),
        "direcetor" : (r["direcetor"]),
        "movie_id" : (r["movie_id"]),
        "genre" : (r["genre"]),
        "stars" : (r["stars"]),
        "rating" : (r["rating"]),
        "imdb_ranking" : (r["imdb_ranking"]),
        "awards" : (r["awards"]),
        "movie_year" : (r["movie_year"]),
        "movie_length" : (r["movie_length"])
        }
      )
  });
  
  
  return {"data" : dataRet};

  //return ({"data" : dataRet}) / dataRet
  //return [movie_name,direcetor,genre];
 
}

async function getDbIDS() {



 

  
  argToUse = 'SELECT movie_id, movie_name, direcetor, genre, stars, rating, imdb_ranking, awards, movie_year, movie_length  from movies';
  let results = await pool.query(argToUse);


  
var dataRet = []

results.rows.forEach(r => {
      dataRet.push(
       (r["movie_id"])
      )
  });
  
  
  return {"IDS" : dataRet};

  //return ({"data" : dataRet}) / dataRet
  //return [movie_name,direcetor,genre];
 
}

async function getDbActors() {



 

  
  argToUse = 'SELECT movie_id, movie_name, direcetor, genre, stars, rating, imdb_ranking, awards, movie_year, movie_length  from movies';
  let results = await pool.query(argToUse);


  
var dataRet = []

results.rows.forEach(r => {
      dataRet.push(
       (r["stars"])
      )
  });
  
  
  return {"Actors" : dataRet};

  //return ({"data" : dataRet}) / dataRet
  //return [movie_name,direcetor,genre];
 
}

async function getDbDirectors() {



 

  
  argToUse = 'SELECT movie_id, movie_name, direcetor, genre, stars, rating, imdb_ranking, awards, movie_year, movie_length  from movies';
  let results = await pool.query(argToUse);


  
var dataRet = []

results.rows.forEach(r => {
      dataRet.push(
       (r["direcetor"])
      )
  });
  
  
  return {"Directors" : dataRet};

  //return ({"data" : dataRet}) / dataRet
  //return [movie_name,direcetor,genre];
 
}

async function InsertDb(args) {



  console.log(args)

 
  
  
  argToUse = 'INSERT INTO movies ( movie_id, movie_name, direcetor, genre, stars, rating, imdb_ranking, awards, movie_year, movie_length )' + " VALUES " + "(";
  
  argsParsed = args.toString()

  inputDp = argToUse + argsParsed + ")"

  console.log(inputDp)
  

  let results = await pool.query(inputDp);


  
  console.log(results)

  
  
  return results

 
}

async function DeleteDb(id) {



  console.log(id)

  
  argToUse = 'DELETE FROM movies WHERE movie_id =';
  
 

  inputDp = argToUse + id;

 
  

  let results = await pool.query(inputDp);


  
  console.log(results)

  
  
  return results

 
}

async function PutDb(id,args) {

  /*
  UPDATE table
SET column1 = value1,
    column2 = value2, ...
WHERE
    condition;
*/

  keys = Object.keys(args)
  values = Object.values(args)

  console.log(id)
  console.log(keys)
  console.log(values)
  
  argToUse = 'UPDATE movies SET '                 // WHERE movie_id =';
  
  keylength = keys.length
 
  for (let i = 0; i < keylength; i++) {
    console.log(argToUse)
    argToUse = argToUse + String(keys[i]) + " = " + String(values[i]) + ","

  } 

  argToUse = argToUse.slice(0,-1);

  argToUse += " WHERE movie_id = " + id

  
  console.log(argToUse)

  

  let results = await pool.query(argToUse);


  
  console.log(results)

  
  
  return results
  

 
}

/*
app.get('/private', requiresAuth(), function (req, res) {       
  const user = JSON.stringify(req.oidc.user);      
  res.render('private', {user}); 
});


*/


app.get('/', async function (req, res) {
  
  let username;
  if (req.oidc.isAuthenticated()) {
    username = req.oidc.user?.name ?? req.oidc.user?.sub;
  }

    
  //res.set({'Content-Type': 'application/nodejs + pug; charset=utf-8'});
  res.render('index', {username}); //printrez:printrez
});


app.get('/auth', (req, res) => {
  res.oidc.login({
    returnTo: '/',
    authorizationParams: {      
      screen_hint: "signup",
    },
  });
});

app.get('/profile', requiresAuth(), function (req, res) {       
  const user = JSON.stringify(req.oidc.user);      
  res.render('profile', {user}); 
});




app.get('/collection', async function (req, res) {

  var dataDB = await getDbSave()

  var dirContext = {
    "@context": {
    "@vocab": "http://schema.org/",
    "movie_name": "name of the movie",
    "rating": "IMDB rating of the movie",
    }
  }

  var data = Object.assign(dataDB,dirContext)

  dataret = JSON.parse(data)

  res.type("application/json")
  res.status(200).json({ status: "OK",
   message: "Sucsesfully returned the whole collection",
    response: dataret})

});

app.get('/ids', async function (req, res) {

  var dataDB = await getDbIDS()

  var dirContext = {
    "@context": {
    "@vocab": "http://schema.org/",
    "IDS": "IDS of all the movies in the database",
    "IDS[x]": "ID of a specific movie, can be used to fetch it from database by .../IDS[x] "
    }
  }

  var data = Object.assign(dataDB,dirContext)

  
  res.type("application/json")
  res.status(200).json({ status: "OK",
   message: "Sucsesfully got all the IDs",
    response: data})

});

app.get('/actors', async function (req, res) {

  var dataDB = await getDbActors()

  var dirContext = {
    "@context": {
    "@vocab": "http://schema.org/",
    "Actors": "Names of all the actors in the database",
    "Actor[x]": "https://schema.org/name"
    }
  }

  var data = Object.assign(dataDB,dirContext)

  

  res.type("application/json")
  res.status(200).json({ status: "OK",
   message: "Sucsesfully got all the actors",
    response: data})


});

app.get('/directors', async function (req, res) {

  var dataDB = await getDbDirectors()

  var dirContext = {
    "@context": {
    "@vocab": "http://schema.org/",
    "Directors": "Names of all the directors in the database",
    "Directors[x]": "https://schema.org/name"
    }
  }

  var data = Object.assign(dataDB,dirContext)
  
  res.type("application/json")
  res.status(200).json({ status: "OK",
   message: "Sucsesfully returned all the directors",
    response: data})


});

app.get('/specification', async function (req, res) {

  data = {
    "title": "IMDB top movies API",
    "description": "API specificaton for top IMDB movies",
    "version": "3.0",
    "paths": {
        "/{movie_id}":{
          "summary": "Get movie by ID",
          "responses": {
            "200": {
              "type": "application/json",
              "description": "Sucsesfully fetched movie by ID",
              "content": "movie (movie_id, movie_name, direcetor, genre, stars, rating, imdb_ranking, awards, movie_year, movie_length)"
            },
            "400": {
              "type": "application/json",
              "description": "Bad request, bad URL and/or parameters",
            }
          }
        },

        "/addMovie":{
          "summary": "Add a movie by ID",
          "responses": {
            "201": {
              "type": "application/json",
              "description": "Sucsefully added a new movie",
              "body": "movie_id, movie_name, direcetor, genre, stars, rating, imdb_ranking, awards, movie_year, movie_length"
            },
            "400": {
              "type": "application/json",
              "description": "Wrong collumn names",
            }
          }},

        "/ids": {
          "summary": "Sucsesfully fetched movie by ID",
          "responses": {
            "200": {
              "type": "application/json",
              "description": "Sucsesfully got all the IDs",
              "body-description": "All the IDS from the collection"
            }
          }
        },

        "/directors": {
          "summary": "Get all the directors",
          "responses": {
            "200": {
              "type": "application/json",
              "description": "Sucsefully returned all the directors",
              "body-description": "All the directors from the database"
            }
          }},

        "/actors": {
          "summary": "Get all the actors",
          "responses": {
            "200": {
              "type": "application/json",
              "description": "Sucsesfully got all the actors",
              "body-description": "all the actors from database"
            }
          }},

          "/collection": {
            "summary": "Get the whole collection",
            "responses": {
              "200": {
                "type": "application/json",
                "description": "Sucsesfully returned the whole collection",
                "body-description": "all the movies"
              }
            }},

        "/":{
          "delete":{
            "summary": "Delete a movie by ID",
            "responses": {
              "202": {
                "type": "application/json",
                "description": "Sucsefully deleted a movie",
                "body": "movie_id"
              },
              "400": {
                "type": "application/json",
                "description": "Wrong collumn names",
              }
            }},

          "put":{
            "summary": "Update a movie",
            "responses": {
              "201": {
                "type": "application/json",
                "description": "Sucsefully updated a movie",
                "body": "movie_id, additional parameters to change"
              },
              "400": {
                "type": "application/json",
                "description": "Wrong collumn names",
              }
            }}
        }

    }


  }
  
  res.type("application/json")
  res.status(200).json({ status: "OK",
  message: "Returned API specification",
    response: data});


});

app.get('/:id', async function (req, res) {
  
  console.log(req.params.id)
  let id = 100 + req.params.id;

  if (isNaN(req.params.id) || req.params.id<0 || req.params.id>1000){

    res.type("application/json")
    res.status(400).json({ status: "Bad Request", 
    message: "Bad request, bad URL and/or parameters"})


  }
  else{
    //var data = await getDbID(req.params.id)

    
    var dataDB = await getDbID(req.params.id)

    var dirContext = {
      "@context": {
      "@vocab": "http://schema.org/",
      "head": "https://schema.org/Movie",
      "movie_name": "https://schema.org/name",
      "hint": "Use IDs above 100"
      }
    }

    var data = Object.assign(dataDB,dirContext)
    

    res.type("application/json")
    res.status(200).json({ status: "OK",
    message: "Sucsesfully fetched movie by ID",
      response: data})
  }
});



app.post('/addMovie', async function (req , res  ) {
  

  let urlR = req.url
  let urlParams = urlR.split("?")
  let params = urlParams[1]
  let parsed = querystring.parse(params) 
 
  console.log(parsed);
  
  //wrong column names

  if(parsed.movie_id != undefined && parsed.direcetor != undefined && 
    parsed.movie_name != undefined && parsed.genre != undefined && parsed.genre != undefined
    && parsed.stars != undefined && parsed.rating != undefined && parsed.imdb_ranking != undefined && parsed.awards != undefined && parsed.movie_year != undefined 
    && parsed.movie_length != undefined)
    {

     

      InsertDb([parsed.movie_id, parsed.movie_name, parsed.direcetor, parsed.genre, parsed.stars, parsed.rating, parsed.imdb_ranking, parsed.awards, parsed.movie_year, parsed.movie_length])


      res.type("application/json")
      res.status(201).json({ status: "Created", 
      message: "Sucsefully added a new movie"})

    }

    else{

      res.type("application/json")
      res.status(400).json({ status: "Bad Request", 
      message: "Wrong collumn names"})
    }


      
    
});

app.delete('/', async function (req , res  ) {
  

  let urlR = req.url
  let urlParams = urlR.split("?")
  let params = urlParams[1]
  let parsed = querystring.parse(params) 
 
  console.log(parsed);
  
  //wrong column names

  if(parsed.movie_id != undefined)
    {

      DeleteDb(parsed.movie_id)

      res.type("application/json")
      res.status(202).json({ status: "Deleted", 
      message: "Sucsefully deleted a movie"})

    }

    else{

      res.type("application/json")
      res.status(400).json({ status: "Bad Request", 
      message: "Wrong collumn names"})
    }


      
    
});




app.put('/', async function (req , res  ) {
  

  let urlR = req.url
  let urlParams = urlR.split("?")
  let params = urlParams[1]
  //let parsed = querystring.parse(params)
  var parsed = QueryStringToJSON(params);


  console.log(parsed)
    
  //wrong column names

  if(parsed.movie_id != undefined)
    {


      
      PutDb(parsed.movie_id, parsed)
      
      res.type("application/json")
      res.status(201).json({ status: "Updated", 
      message: "Sucsefully updated a movie"})

    }

    else{

      res.type("application/json")
      res.status(400).json({ status: "Bad Request", 
      message: "Wrong collumn names"})

    }


      
    
});


app.post('/query', async function (req , res  ) {
  


  console.log(req.body);
 
  
  



  const data = await getDbSave(req.body.Query)

    

  console.log( data)
    
  var movie_name = data[0]
  var direcetor = data[1]
  var genre = data[2]


  res.render('index', {data}); //movie_name,direcetor,genre
  
  
      
      
    
});

app.get('/queryAJAX', async function (req , res  ) {
  
  console.log(req.body);
 

  const data = await getDbSave(req.body.Query)

  console.log( data)
    
  var movie_name = data[0]
  var direcetor = data[1]
  var genre = data[2]


  //res.render('index', {data}); //movie_name,direcetor,genre
  
  res.send(data)
    
});






/*
app.listen(4080);
module.exports = app;
*/


https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app)
.listen(port, function () {
  console.log(`Server running at https://localhost:${port}/`);
});
