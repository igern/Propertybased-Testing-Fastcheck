import { SimpleDb } from './lokiModel'
import * as loki from "lokijs";
import fc from 'fast-check';
import * as assert from 'assert';
import { betterObject } from './ourObject';

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

class RemoveCommand implements fc.Command<SimpleDb, Collection<any>>{
    record: object;
    check = (model: Readonly<SimpleDb>): boolean => model.count() > 0
    run(model: SimpleDb, loki: Collection<any>): void {
        this.record = model.data[Math.round(Math.random() * (model.count() - 1))]
        model.remove(this.record);
        loki.findAndRemove(this.record)
    }
    toString(): string {
        return `REMOVE(${JSON.stringify(this.record)})`
    }
}

class SizeCommand implements fc.Command<SimpleDb, Collection<any>>{
    check = () => true
    run(model: SimpleDb, loki: Collection<any>): void {
        if(model.count() != loki.count()){
            console.log(model.callStack);
            model.assertionErrors +=  `${model.count()}:${loki.count()}\n`
            console.log(model.assertionErrors);
            assert.equal(model.count(), loki.count());
        }
    }
    toString(): string {
        return `COUNT`
    }
}

const allCommands = [
    betterObject.map(v => new InsertCommand(v)),
    fc.constant(new RemoveCommand()),
    fc.constant(new SizeCommand())
];


describe('', () => {
    // string text always contains itself
    it('', () => {
        fc.assert(
            fc.property(fc.commands(allCommands, 100), cmds => {
                const s = () => ({ model: new SimpleDb(), real: new loki('loki.json').addCollection('testing') });
                fc.modelRun(s, cmds);
            }), { verbose: true }
        )
    }).timeout(10000)
});
//seed: 1037837345, path: "2:2:2:4:3:4:5:4:9:7", endOnFailure: true,