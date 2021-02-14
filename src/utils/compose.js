const compose = (...funcs) => (comp) => {
    return funcs.reduceRight(
        (wrapped, f) => f(wrapped), comp)
}


export default compose;

// compose(f1,f2,f3)(value)

//f1(f2(f3(value)))

// в данном случае (... funcs)- это массив через spread, а reduceRight() это метод перебора массива справа на лево