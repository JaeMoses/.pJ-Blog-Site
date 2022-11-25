const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config()
const port =3000;
const style = app.use(express.static((__dirname + '/public')));
const configs = config ={
    method:"GET",
    url:"https://zenquotes.io/api/quotes/[your_key]"
};

app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended:true}));



mongoose.connect("mongodb+srv://"+(process.env.DB_User)+":"+(process.env.DB_pass)+"@cluster0.ba7lhwx.mongodb.net/blogdb");

const Post = mongoose.model('Post', {title: String , body: String});





let Quotes = [];
let newQuote = 0 ;
let runOnce = 0;




app.get('/', function(req, res) {

    runOnce = runOnce + 1;
    configs
    axios(configs)
    .then(function(response) {
        Quotes = response.data;
    })
    .catch(function(err) {
        console.log(err);
    });
    // style
    res.render('index');
});

app.post('/', function(req, res) {
    res.redirect('/quotes');
});

 app.get('/quotes', function(req, res) {
    
    if (newQuote === 50) {
        axios(configs)
        .then(function res (response) {
            Quotes = response.data;
        })
        .catch(function(err) {
            console.log(err);
        });
        newQuote = 0;
    };
    
    
    if (runOnce === 0){
    configs
    axios(configs)
    .then(function(response) {
    Quotes=response.data;
    console.log(200);
    try{
    apiQuote= JSON.stringify(Quotes[newQuote].q);
    quoteAuthor= JSON.stringify(Quotes[newQuote].a);
    }
    catch(err){
        res.redirect('/posts');
    }
    while (newQuote<=Quotes.length){
       newQuote = newQuote + 1;
       break
    };
    
    // style
    res.render('quotes',{apiQuote: apiQuote, quoteAuthor: quoteAuthor});
    })
    .catch(function(err) {
        console.log(err);
    });
    runOnce = runOnce + 1;
    }else{
        try {
        apiQuote= JSON.stringify(Quotes[newQuote].q);
        quoteAuthor= JSON.stringify(Quotes[newQuote].a);
        }
        catch(err) {
            res.redirect('/posts');
        }
        while (newQuote<=Quotes.length){
           newQuote = newQuote + 1;
           break
        };
        // style
     res.render('quotes',{apiQuote: apiQuote, quoteAuthor: quoteAuthor});
    };
});
    
    
app.get('/compose', function(req, res){
    res.render('compose');
});

app.post('/compose', function(req, res){
    
    let title = req.body.title;
    let body = req.body.body;

    const post = new Post({title: title, body: body});
    post.save(function(err){
            if (!err){
                res.redirect("/posts");
            };
        });
});
    
    
app.get('/posts', function(req, res) {

    Post.find({}, function(err, posts){
            res.render("posts",{posts: posts});
    });
});

app.get('/posts/:postId', function(req, res){
    
    const requestedPostId = req.params.postId;
    
    Post.findById({_id:requestedPostId}, function(err, posts){
        res.render("post",{title: posts.title, body: posts.body});
    });
});

app.get('/contact', function(req, res){
    res.render('contact');
});


app.listen(port|| 3000,function() {
    console.log('Listening on port ' + port);
});