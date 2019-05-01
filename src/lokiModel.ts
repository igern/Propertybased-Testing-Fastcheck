import { record } from "fast-check/*";
import { single_entry_empty_variableName_fixed, name_starting_with_dot_fixed } from "./lokiBugs";

export class SimpleDb {
    data: object[] = []
    insert = (record: object) => this.data.push(record);
    remove = (record: object) => remove(record, this);
    count = () => this.data.length
}

function remove(recordToRemove: object, database: SimpleDb) {


    if (single_entry_empty_variableName_fixed) {
        if (Object.keys(recordToRemove).length == 1) {
            if (recordToRemove[""] != null) {
                database.data = [];
            }
        }
    }

    if (Object.keys(recordToRemove).length == 0) {
        database.data = [];
    }
    for (let i = database.data.length - 1; i >= 0; i--) {
        if (JSON.stringify(recordToRemove) === JSON.stringify(database.data[i])) {
            if (name_starting_with_dot_fixed) {
                Object.keys(recordToRemove).forEach(key => {
                    if (key[0] != ".") {
                        database.data.splice(i, 1);
                    }
                });
            } else {
                database.data.splice(i, 1);
            }
        }
    }
}

var dummy = new SimpleDb();
dummy.insert({ hello: "Holst" })
dummy.insert({ ".": "" })
//dummy.insert({ "_~Fv{`i*;": 496909701, "]@1;.*Ec)4": -1067086941 })
console.log(dummy.data);
dummy.remove({ "-": 0 })
//dummy.remove({ "-": 0 })
console.log(dummy.data);
console.log(dummy.count());

