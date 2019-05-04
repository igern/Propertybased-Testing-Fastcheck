import fc, { Arbitrary, Random, Shrinkable } from 'fast-check';
import { key_with_dot_and_key_empty_with_null_value_fixed, everything_with_dot_fixed } from './lokiBugs';




export function ultimateObject(): Arbitrary<any> {
    return dictionary(bugString(),
        fc.oneof<any>(fc.boolean(),
            fc.integer(), fc.double(),
            fc.string(),
            fc.oneof(
                fc.constant(null), fc.constant(undefined),
            ),
            fc.oneof(
                fc.double(),
                fc.constant(-0),
                fc.constant(0),
                fc.constant(Number.NaN),
                fc.constant(Number.POSITIVE_INFINITY),
                fc.constant(Number.NEGATIVE_INFINITY),
                fc.constant(Number.EPSILON),
                fc.constant(Number.MIN_VALUE),
                fc.constant(Number.MAX_VALUE),
                fc.constant(Number.MIN_SAFE_INTEGER),
                fc.constant(Number.MAX_SAFE_INTEGER)
            )
        )
    );
}

export const opject: Arbitrary<Object> = ultimateObject().filter((dic) => {
    if (key_with_dot_and_key_empty_with_null_value_fixed) {
        if (Object.keys(dic).some((key) => key.includes("."))) {
            if (dic[Object.keys(dic).find((key) => key === "")] === null) {
                return false;
            }
        }
    }
    return true;
});

export function bugString(): Arbitrary<string> {
    return everything_with_dot_fixed ? fc.string().filter((str) => !str.includes(".")) : fc.string()
}


// export const betterObject: Arbitrary<Object> = fc.object().filter((o) => {
//     let returning = true
//     if (Object.keys(o).length == 0) {
//         returning = Math.random() > 0.5;
//     }
//     Object.keys(o).forEach((key) => {
//         if (o[key] instanceof Object || o[key] instanceof Array) {
//             returning = false;
//         }
//     })
//     return returning
// });

// fc.statistics(
//     ultimateObject(),
//     v => Object.keys(v).length.toString(),
//     { numRuns: 1000, logger: console.log }
// );

console.log(fc.sample(ultimateObject(), 10))

function toObject<T>(items: [string, T][]): { [key: string]: T } {
    const obj: { [key: string]: T } = {};
    for (const keyValue of items) {
        obj[keyValue[0]] = keyValue[1];
    }
    return obj;
}

/**
 * For dictionaries with keys produced by `keyArb` and values from `valueArb`
 * @param keyArb Arbitrary used to generate the keys of the object
 * @param valueArb Arbitrary used to generate the values of the object
 */
function dictionary<T>(keyArb: Arbitrary<string>, valueArb: Arbitrary<T>): Arbitrary<{ [key: string]: T }> {
    return fc.set(fc.tuple(keyArb, valueArb), 0, 100, (t1, t2) => t1[0] === t2[0]).map(toObject);
}