export function naturalSorter(x, y) {
    if (x === y) {
        return 0;
    }

    let rx =/(\.\d+)|(\d+(\.\d+)?)|([^\d.]+)|(\.\D+)|(\.$)/g;
    let a = x.toLowerCase().match(rx);
    let b = y.toLowerCase().match(rx);

    let i = 0;
    for (; i < a.length; i++) {
        if (!b[i]) {
            return 1;
        }

        let a1 = a[i];
        let b1 = b[i];

        if (a1 !== b1) {
            let n = a1-b1;
            if (!isNaN(n)) {
                return n;
            }

            return a1>b1? 1:-1;
        }
    }

    return b[i]? -1:0;
}

export default {
    naturalSorter
};
