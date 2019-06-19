import { SimpleDb } from './lokiModel'
import * as loki from "lokijs";
import fc from 'fast-check';
import * as assert from 'assert';
import { filterObjectArb } from './ourObject';

class InsertCommand implements fc.Command<SimpleDb, Collection<any>>{
    constructor(readonly record: object) { }
    check = () => true
    run(model: SimpleDb, loki: Collection<any>): void {
        var jiss = JSON.stringify(this.record)
        model.insert(JSON.parse(jiss));
        loki.insert(JSON.parse(jiss));
    }
    toString(): string {
        return `INSERT(${JSON.stringify(this.record)})`
    }
}

class InsertManyCommand implements fc.Command<SimpleDb, Collection<any>>{
    constructor(readonly records: object[]) { }
    check = () => true
    run(model: SimpleDb, loki: Collection<any>): void {
        var jsonRecord = JSON.stringify(this.records)
        model.insertMany(JSON.parse(jsonRecord))
        loki.insert(JSON.parse(jsonRecord));
    }
    toString(): string {
        return `INSERTMANY(${JSON.stringify(this.records)}`
    }
}

class RemoveCommand implements fc.Command<SimpleDb, Collection<any>>{
    record: object;
    constructor(readonly seed: number) { }
    check = (model: Readonly<SimpleDb>): boolean => model.count() > 0
    run(model: SimpleDb, loki: Collection<any>): void {
        this.record = model.data[Math.round(this.seed * (model.count() - 1))]
        model.remove(this.record);
        try {
            loki.findAndRemove(this.record)

        } catch (error) {
            console.log(model.callStack)
            throw error
        }
    }
    toString(): string {
        return `REMOVE(${JSON.stringify(this.record)})`
    }
}

class SizeCommand implements fc.Command<SimpleDb, Collection<any>>{
    check = () => true
    run(model: SimpleDb, loki: Collection<any>): void {
        if (model.count() != loki.count()) {
            console.log(model.callStack);
            model.assertionErrors += `${model.count()}:${loki.count()}\n`
            console.log(model.assertionErrors);
            assert.equal(model.count(), loki.count());
        }
    }
    toString(): string {
        return `COUNT`
    }
}

class MinCommand implements fc.Command<SimpleDb, Collection<any>>{
    record: object
    field: string;
    check = (model: Readonly<SimpleDb>): boolean => model.count() > 0
    run(model: SimpleDb, loki: Collection<any>): void {
        this.record = model.data[Math.round(Math.random() * (model.count() - 1))]
        if (Object.keys(this.record).length > 0) {
            this.field = Object.keys(this.record)[Math.round(Math.random() * (Object.keys(this.record).length - 1))];
        } else {
            return
        }
        var modelMin = model.min(this.field);
        var lokiMin = loki.min(this.field);
        if (Number.isNaN(modelMin) && Number.isNaN(lokiMin)) {
            return
        } else if (modelMin != lokiMin) {
            console.log(model.callStack);
            model.assertionErrors += `${model.min(this.field)}:${loki.min(this.field)}\n`
            console.log(model.assertionErrors);
            assert.equal(model.min(this.field), loki.min(this.field));
        }
    }
    toString(): string {
        return `MIN(${JSON.stringify(this.field)})`
    }

}

const allCommands = [
    filterObjectArb.map(v => new InsertCommand(v)),
    //fc.array(filterObjectArb).map(v => new InsertManyCommand(v)),
    fc.nat().noShrink().map(s => new RemoveCommand(s)),
    fc.constant(new SizeCommand()),
    //fc.constant(new MinCommand())
];

describe('', () => {
    it('', () => {
        fc.assert(
            fc.property(fc.commands(allCommands, 100), cmds => {
                const s = () => ({ model: new SimpleDb(), real: new loki('loki.json').addCollection('testing') });
                fc.modelRun(s, cmds);
            }), { verbose: false }
        )
    }).timeout(1000000)
});

// let replayPath = "AC/Vg:S"
// let seed = -1197376503
// let path = "1:5:3:3:3:3:3:3:4:3:3:7"
// describe('', () => {
//     it('', () => {
//         fc.assert(
//             fc.property(fc.commands(allCommands, { maxCommands: 100, replayPath: replayPath }),
//                 cmds => {
//                     const s = () => ({ model: new SimpleDb(), real: new loki('loki.json').addCollection('testing') });
//                     fc.modelRun(s, cmds);
//                 }), { verbose: false, seed: seed, path: path, endOnFailure: true }
//         )
//     }).timeout(1000000)
// });