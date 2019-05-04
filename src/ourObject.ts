import fc, { Arbitrary, Random, Shrinkable } from 'fast-check';



export const betterObject: Arbitrary<Object> = fc.object().filter((o) => {
    let returning = true
    if (Object.keys(o).length == 0) {
        returning = Math.random() > 0.5;
    }
    Object.keys(o).forEach((key) => {
        if (o[key] instanceof Object) {
            returning = false;
        }
    })
    return returning
});

// fc.statistics(
//     betterObject,
//     v => Object.keys(v).length.toString(),
//     { numRuns: 100, logger: console.log }
// );

//console.log(fc.sample(betterObject, 10))

