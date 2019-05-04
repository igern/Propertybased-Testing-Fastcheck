import * as loki from "lokijs";

var database = new loki('loki.json');

var db = database.addCollection('children');
db.insert({ "name": "mathies", "height": 160 })
db.insert({ "name": "jonas", "height": 175 })
db.insert({ "name": "daniel", "height": 174 })
console.log(db.min("name"))
//console.log(children.find({ qty: 100, item: "paper", tags: ["red", "blank", "plain"] }))

//console.log(children.find())

//children = new loki('loki.json').addCollection('children');

//console.log(`New?? ${children.find({})}`);
//INSERT{"meta":{"revision":0,"created":1556734809595,"version":0},"$loki":1}
//REMOVE([{"meta":{"revision":0,"created":1556734809595,"version":0},"$loki":1}
