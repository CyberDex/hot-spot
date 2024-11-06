export function runAndMeasure(fn: any, params: any): any {
    const start = Date.now();

    const result = fn(params);

    // eslint-disable-next-line no-console
    console.log(
        `%c ${getFunctionName(fn)}: ${(Date.now() - start) / 1000} sec `,
        'font-weight: bold; color: black; background-color: white; font-size: 16px;',
    );

    return result;
}

function getFunctionName(fn: any) {
    return fn.toString().split(')')[0].split(' ')[1].split('(')[0];
}
