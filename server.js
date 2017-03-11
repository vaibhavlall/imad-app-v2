var express = require('express');
var morgan = require('morgan');
var path = require('path');
var app = express();
var Pool=require('pg').Pool;
var crypto=require('crypto');
var bodyParser=require('body-parser');

var config= {
    user:'vaibhavlall',
    database:'vaibhavlall',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:'db-vaibhavlall-44050'
};
var pool=new Pool(config);
app.use(morgan('combined'));
app.use(bodyParser.json());
var counter=0;
app.get('/counter',function(req,res)
{
  counter=counter+1;
  res.send(counter.toString());
});
app.get('/test-db',function(req,res)
{
    pool.query('select * from article',function(err,result)
    {
        if(err)
        {
            res.status(500).send(err.toString());
        }
        else
        {
            res.send(JSON.stringify(result.rows));
        }
    })
});
function createTemplate(data)
{
	var title=data.title;
	var heading=data.heading;
	var date=data.date;
	var content=data.content;
	var htmlTemplate=
	`<html><head><title>${title}</title>
	<meta ="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" type="text/css" href="style.css"/></head>
	<body><div class="container"><a href="/">Home</a><h1>${heading}</h1></br>${date.toDateString()}<br/><div>${content}</div></body></html>`;
	return htmlTemplate;
}

function hash(input,salt)
{
    var hashed=crypto.pbkdf2Sync(input, salt, 10000, 512,'sha512');
    return["pbkdf2","10000",salt,hashed.toString('hex')].join('$');
    
}
app.get('/hash/:input',function(req,res)
{
    var hashedString=hash(req.params.input,'this-is-some-random-string');
    res.send(hashedString);
});
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
app.get('/articles/:articleName', function (req, res) {
	var articleName=req.params.articleName;
pool.query("Select * from article1 where title=$1",[req.params.articleName],function(err,result){
    if(err)
    {
        res.status(500).send(err.toString());
    }
    else
    {
        if(result.rows.length===0)
        {
            res.status(404).send('Article not Found');
        }
        else
        {
            var articleData=result.rows[0];
         	res.send(createTemplate(articleData))
        }
    }
    
})
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.post('/create-user',function(req,res)
{
    var username=req.body.username;
    var password=req.body.password;
    var salt=crypto.getrandomBytes(128).toString('hex');
    var dbString=hash(password,salt);
    pool.query('insert into user1(username,password)values($1,$2)',[username,dbString],function(err,result)
    {
        if(err)
        {
            res.status(500).send(err.toString());
        }
        else
        {
            res.send('User successfully created '+ username);
        }
    });
});
app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});
var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
