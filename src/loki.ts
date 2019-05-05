import * as loki from "lokijs";

var database = new loki('loki.json');


var db = database.addCollection('children');
db.insert({ "name": "Mathies", "height": { "lower": 150, "higher": 160 }, "intesterest": ["code", "eat", "sleep"] })
db.insert({ "name": "Jonas", "height": { "lower": 175, "higher": 210 }, "intesterest": ["code", "eat", "sleep", "movies"] })
db.insert({ "name": "Daniel", "height": { "lower": 173, "higher": 174 }, "intesterest": ["code", "eat", "sleep", "ardunio", "pizza"] })

console.log(db.find({ "height.lower": 150 }))