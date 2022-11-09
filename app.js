const express = require("express")
const bodyParser = require("body-parser")
const port = 3000;
const date = require( __dirname+"/date.js")


const app = express();
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'))

var items = ["make", "to do", "wriet"];
var worklist = []



app.get("/", function(req, res){
var day = date.getDay()
res.render("list", {listTitle:day, listitem :items})

});



app.post("/",function(req, res){
    var item = req.body.data
    console.log(req.body)
    if (req.body.list=="Work"){
        worklist.push(item);
        res.redirect("/work")
    }else{
   items.push(item);
   res.redirect("/")}
})



app.get("/work", function(req,res){
    var day = today.toLocaleDateString("en-US", options).split(",")[0]
    res.render("list", {listTitle:"Work List", listitem:worklist})
})


app.listen(port, function(){
    console.log("server is running on port"+ port);
});