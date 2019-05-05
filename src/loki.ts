import * as loki from "lokijs";

var database = new loki('loki.json');

// var db = database.addCollection('children');
// db.insert({ " ": null });
// db.count();
// db.count();
// console.log(db.min(" "))

// var db = database.addCollection('children');
// db.insert({ "a": 3 })
// db.insert({ "a": 2 })
// db.insert({ "height": 160 })
// console.log(db.minRecord("a"))

var db = database.addCollection('children');
db.insert({ "name": "Mathies", "height": { "lower": 150, "higher": 160 }, "intesterest": ["code", "eat", "sleep"] })
db.insert({ "name": "Jonas", "height": { "lower": 175, "higher": 210 }, "intesterest": ["code", "eat", "sleep", "movies"] })
db.insert({ "name": "Daniel", "height": { "lower": 173, "higher": 174 }, "intesterest": ["code", "eat", "sleep", "ardunio", "pizza"] })

console.log(db.find({ "height.lower": 150 }))






//console.log(children.find({ qty: 100, item: "paper", tags: ["red", "blank", "plain"] }))

//console.log(children.find())

//children = new loki('loki.json').addCollection('children');

//console.log(`New?? ${children.find({})}`);
//INSERT{"meta":{"revision":0,"created":1556734809595,"version":0},"$loki":1}
//REMOVE([{"meta":{"revision":0,"created":1556734809595,"version":0},"$loki":1}
