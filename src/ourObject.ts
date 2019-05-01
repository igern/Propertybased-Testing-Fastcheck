import fc, { Arbitrary, json } from 'fast-check';
import { array_Matching_Does_Not_Work_With_Remove_Fixed } from './bugs';

export class OurObject extends Arbitrary<Object>{
    generate(mrng: fc.Random): fc.Shrinkable<Object> {
        let object = fc.object().generate(mrng).value;
        Object.keys(object).forEach((key) => {
            if (object[key] instanceof Array) {
                object[key] = fc.string().generate(mrng).value;
            }
        })
        console.log(object)
        return object;
    }
}

export const betterObject: Arbitrary<Object> = fc.object().filter((o) => {
    let returning = true
    Object.keys(o).forEach((key) => {

        if (o[key] instanceof Array || o[key] instanceof Object) {
            returning = false;
        }
    })
    return returning
});
