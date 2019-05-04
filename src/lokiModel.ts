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
    insertMany = (records: object[]) => {
        this.callStack += `db.insertMany( ${JSON.stringify(records)});\n`
        records.forEach(record => this.data.push(record));
    };
    remove = (record: object) => {
        this.callStack += `db.remove(${JSON.stringify(record)});\n`
        remove(record, this)
    };
    count = () => {
        this.callStack += `db.count();\n`
        return this.data.length
    }
    min = (field: string) => {
        this.callStack += `db.min(${field})`
        return min(field, this);
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
        if (partialEquivalen(recordToRemove, database.data[i])) {
            if (name_starting_with_dot_fixed) {
                if (Object.keys(recordToRemove).some(key => key.includes("."))) {
                    continue // Skips object containg key with initial dot
                }
            }
            database.data.splice(i, 1);
        }
    }
}

function partialEquivalen(recordToRemove, record) {
    return Object.keys(record).every((value, index, array) => {
        return value in recordToRemove && recordToRemove[value] == record[value]
    })
}


function min(field: string, database: SimpleDb) {
    const values = []
    database.data.forEach((record) => {
        if (record[field] != undefined) {
            values.push(record[field])
        }
    })
    return values.reduce((min, next) => next < min ? next : min, values[0]);
}
var db = new SimpleDb();
db.insertMany([{}, { "\"": 1.7976931348623157e+308 }]);
db.count();
db.count();
db.remove({ "\"": 1.7976931348623157e+308 });
db.count();


