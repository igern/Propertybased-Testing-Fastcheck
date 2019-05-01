import * as loki from "lokijs";

var db = new loki('loki.json');

var children = db.addCollection('children');
children.insert({ hello: "erg", ".hrthtr": "" })
console.log(children.count());
console.log(children.find({ hello: "erg", ".hrthtr": "" }))
console.log(children.count());

//console.log(children.find({ qty: 100, item: "paper", tags: ["red", "blank", "plain"] }))

//console.log(children.find())

//children = new loki('loki.json').addCollection('children');

//console.log(`New?? ${children.find({})}`);
//INSERT{"meta":{"revision":0,"created":1556734809595,"version":0},"$loki":1}
//REMOVE([{"meta":{"revision":0,"created":1556734809595,"version":0},"$loki":1}