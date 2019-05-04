import { record } from "fast-check/*";
import { single_entry_empty_variableName_fixed, name_starting_with_dot_fixed } from "./lokiBugs";

export class SimpleDb {
    data: object[] = []
    callStack: string = "CALLSTACK: ";
    assertionErrors: string = "ASSERTION: ";
    insert = (record: object) => {
        this.callStack += `db.insert(${JSON.stringify(record)});\n`
        this.data.push(record)
    };
    remove = (record: object) => {
        this.callStack += `db.remove(${JSON.stringify(record)});\n`
        remove(record, this)
    };
    count = () => {
        this.callStack += `db.count();\n`
        return this.data.length
    }
}

function remove(recordToRemove: object, database: SimpleDb) {


    if (single_entry_empty_variableName_fixed) {
        if (Object.keys(recordToRemove).length == 1) {
            if (Object.keys(recordToRemove)[0] == "") {
                database.data = [];
            }
        }
    }

    if (Object.keys(recordToRemove).length == 0) {
        database.data = [];
    }
    for (let i = database.data.length - 1; i >= 0; i--) {
        let recordtr = JSON.stringify(recordToRemove);
        let dbrecord = JSON.stringify(database.data[i]);
        if (JSON.stringify(recordToRemove) === JSON.stringify(database.data[i])) {
            if (name_starting_with_dot_fixed) {
                if (Object.keys(recordToRemove).some(key => key.includes("."))) {
                    continue // Skips object containg key with initial dot
                }
            }
            database.data.splice(i, 1);
        }
    }
}

var db = new SimpleDb();
console.log(db.count());

