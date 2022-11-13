const express = require("express")
const bodyParser = require("body-parser");
const mongoose= require("mongoose");
const date = require( __dirname+"/date.js")
const _ = require("lodash")
const port = 3000;


const app = express();
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'))

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");
const itemSchema = new mongoose.Schema({
    name:String
})
const Item = mongoose.model("item", itemSchema);
const defaultitems = [{name:"Welcome to your ToDolist!"},{name:"Hit + button to add new item."},{name:"<-- Hit this to delete an item"}];

const listSchema = {
    name:String,
    items:[itemSchema]
}
const List = mongoose.model("list", listSchema)
var day = date.getDay()

app.get("/", function(req, res){


Item.find({},function(err,document){
    if (document.length==0){
        Item.insertMany(defaultitems, function(error, doc){
            if (error){
                console.log(error);
            }else{
                console.log("Successfully saved defaultitems to DB.")
            }
        })
        res.redirect("/")
    }else{
    res.render("list", {listTitle:day, listitem :document})}
    })

});

app.post("/",function(req, res){
    const listname = req.body.list
    const item = req.body.item
    const additem = new Item({name:item})
    if (listname==day){
        additem.save()   
        res.redirect("/")
    }else{
        List.findOne({name:listname},function(err, foundlist){
             if(!err){
                foundlist.items.push(additem);
                foundlist.save();
                res.redirect("/"+listname)
             }
        })
    }
    
   
})

app.post("/delete", function(req, res){
   const listname = req.body.listName;
   const completedid = req.body.checkbox;
   console.log(listname)
   if(listname==day){
    Item.deleteOne({_id:completedid}, function(err, doc){
        if (err){
            console.log(err);
        }else{
            res.redirect("/")
        }
       })
   }else{
    List.findOneAndUpdate({name:listname},{$pull:{items:{_id:completedid}}}, function(err, doc){
        if (err){
            console.log(err);
        }else{
            res.redirect("/"+listname)
        }
    })
   }
   
})

app.get("/:customList", function(req, res){
    const customList =_.capitalize(req.params["customList"]);
    
    List.findOne({name:customList}, function(err, doc){
        if (!err){
            if (doc==null){
                const list = new List({
                    name:customList,
                    items:defaultitems
                })
                list.save(); 
                res.redirect("/"+customList)
             }
            else{
                res.render("list", {listTitle:customList, listitem :doc.items})
            }
        }
    })
    
    

})


// port listining
app.listen(port, function(){
    console.log("server is running on port"+ port);
});