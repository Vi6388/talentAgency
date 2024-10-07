export const numberFormat = (numStr) => {
    let result = numStr;
    if (isNaN(parseFloat(result)) || parseFloat(result) === 0) {
        result = 0
    } else {
        const str = numStr.replaceAll(",", "");
        result = parseFloat(str).toLocaleString();
        if(numStr[numStr.length - 1] === ".") {
            result += ".";
        }
    }

    return result;
}