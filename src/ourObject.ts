import fc, { Arbitrary } from 'fast-check';


export const betterObject: Arbitrary<Object> = fc.object().filter((o) => {
    let returning = true
    Object.keys(o).forEach((key) => {

        if (o[key] instanceof Array || o[key] instanceof Object) {
            returning = false;
        }
    })
    return returning
});

// fc.statistics(
//     betterObject,
//     v => Object.keys(v).length < 5 ? 'Small dictionary' : 'Big dictionary',
//     { numRuns: 10000, logger: console.log }
// );

