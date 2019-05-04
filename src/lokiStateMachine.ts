import { SimpleDb } from './lokiModel'
import * as loki from "lokijs";
import fc from 'fast-check';
import * as assert from 'assert';
import { ultimateObject, opject } from './ourObject';

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
        var jiss = JSON.stringify(this.records)
        model.insertMany(JSON.parse(jiss))
        loki.insert(JSON.parse(jiss));
    }
    toString(): string {
        return `INSERTMANY(${JSON.stringify(this.records)}`
    }
}

class RemoveCommand implements fc.Command<SimpleDb, Collection<any>>{
    record: object;
    check = (model: Readonly<SimpleDb>): boolean => model.count() > 0
    run(model: SimpleDb, loki: Collection<any>): void {
        this.record = model.data[Math.round(Math.random() * (model.count() - 1))]
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
    check = () => true
    run(model: SimpleDb, loki: Collection<any>): void {
        this.record = model.data[Math.round(Math.random() * (model.count() - 1))]
        this.field = Object.keys(this.record)[Math.round(Math.random() * (Object.keys(this.record).length - 1))];
        if (model.min(this.field) != loki.min(this.field)) {
            console.log(model.callStack);
            model.assertionErrors += `${model.min(this.field)}:${loki.min(this.field)}\n`
            console.log(model.assertionErrors);
            assert.equal(model.min(this.field), loki.min(this.field));
        }
    }
}

const allCommands = [
    opject.map(v => new InsertCommand(v)),
    fc.array(opject).map(v => new InsertManyCommand(v)),
    fc.constant(new RemoveCommand()),
    fc.constant(new SizeCommand()),
    fc.constant(new MinCommand())
];


describe('', () => {
    // string text always contains itself
    it('', () => {
        fc.assert(
            fc.property(fc.commands(allCommands, 100), cmds => {
                const s = () => ({ model: new SimpleDb(), real: new loki('loki.json').addCollection('testing') });
                fc.modelRun(s, cmds);
            }), { verbose: false }
        )
    }).timeout(1000000)
});
//seed: 1037837345, path: "2:2:2:4:3:4:5:4:9:7", endOnFailure: true,