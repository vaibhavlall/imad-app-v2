var express = require('express');
var morgan = require('morgan');
var path = require('path');
var app = express();
var Pool=require('pg').Pool;

var config= {
    user:'vaibhavlall',
    database:'vaibhavlall',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:'db-vaibhavlall-44050'
};
var pool=new Pool(config);
app.use(morgan('combined'));
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
var articles={
'article-one': 
{
    title:`Article One | Vaibhav Lall`,     
    heading:'Article One',     
    date:'Sept 5 2017',     
    content:`
    <p>Welcome to article one Welcome to articleone Welcome to article one</p>` 
 },
  'article-two': 
  {
    title:`Article Two | Vaibhav Lall`,     
    heading:'Article Two',     
    date:'Sept 10 2017',     
    content:`
    <p>Welcome to article two</p> `
  },
  'article-three': 
  {
    title:`Article Three | Vaibhav Lall`,     
    heading:'Article Three',     
    date:'Sept 15 2017',     
    content:`
    <p>Welcome to article three</p> `
  }
};
function createTemplate(data)
{
	var title=data.title;
	var heading=data.heading;
	var date=data.date;
	var content=data.content;
	var htmlTemplate=
	`<html><head><title>${title}</title>
	<meta ="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" type="text/css" href="style.css"/></head>
	<body><div class="container"><a href="/">Home</a><h1>${heading}</h1></br>${date}<br/><div>${content}</div></body></html>`;
	return htmlTemplate;
}
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
app.get('/articles/:articleName', function (req, res) {
	var articleName=req.params.articleName;
pool.query("Select * from article1 where title='"+req.params.articleName+"'",function(err,result){
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
         	res.send(createTemplate(articles[articleName]))
        }
    }
    
})
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});
var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
