"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});

function parser(input) {
    let output = [
        []
    ];
    let lastOutputIndex = 0;
    let initialColumn = 'a';
    let initialRow = 1;
    let currentElement = '';
    let currentColumn = initialColumn;
    let currentRow = initialRow;
    let currentCell = currentColumn + currentRow;
    let prevCell;
    let status = 'space';
    let operatorCount = 0;
    let operandCount = 0;
    let linkCount = 0;
    let linkIndex;
    const cache = {};
    const map = {};
    const cacheLinkCount = {};

    function updateLinks(cell) {
        if (cache[cell]) {
            cache[cell].forEach(item => {
                output[item.index][item.linkIndex] = +map[cell];
                if (!--cacheLinkCount[item.cell]) {
                    console.log(item.cell, cacheLinkCount, output[item.index]);
                    map[item.cell] = output[item.index] = postFixExec(output[item.index]);
                    updateLinks(item.cell);
                }
            });
        }
        map[prevCell] = output[lastOutputIndex];
    }

    function execByOperator(first, second, operator) {
        switch (operator) {
            case '+':
                return first + second;
            case '/':
                return first - second;
            case '-':
                return first - second;
            case '*':
                return first * second;
        }
    }

    function postFixExec(input) {
        let output = 0;
        const stack = [];
        for (let i = 0; i < input.length; i++) {
            const current = input[i];
            let first;
            let second;
            switch (current) {
                case '+':
                    if (stack.length < 2) {
                        return '#ERR';
                    }
                    [first, second] = stack.splice(-2);
                    output = +first + +second;
                    stack.push(output);
                    break;
                case '-':
                    if (stack.length < 2) {
                        return '#ERR';
                    }
                    [first, second] = stack.splice(-2);
                    output = +first - +second;
                    stack.push(output);
                    break;
                case '*':
                    if (stack.length < 2) {
                        return '#ERR';
                    }
                    [first, second] = stack.splice(-2);
                    output = +first * +second;
                    stack.push(output);
                    break;
                case '/':
                    if (stack.length < 2) {
                        return '#ERR';
                    }
                    [first, second] = stack.splice(-2);
                    output = +first / +second;
                    stack.push(output);
                    break;
                default:
                    stack.push(current);
            }
        }
        switch (stack.length) {
            case 0:
                return '0';
            case 1:
                return stack[0].toString();
            default:
                return '#ERR';
        }
    }
    //   console.log(postFixExec([]));
    //   console.log(postFixExec([3]));
    //   console.log(postFixExec([2, 3]));
    //   console.log(postFixExec(['+']));
    //   console.log(postFixExec(['+', 3]));
    //   console.log(postFixExec([3, 4, '+']));
    //   console.log(postFixExec([5, '+', 2, '+', 4, '*', '+', 3, '-']));
    //   console.log(postFixExec([5, 1, 2, '+', 4, '*', '+', 3, '-']));
    //   console.log(postFixExec([5, 1, 2, '+', 4, '*', '+', 3]));
    function cacheLink(lastOutputIndex, currentElement) {
        if (typeof map[currentElement] !== 'undefined') {
            currentElement = map[currentElement];
            output[lastOutputIndex].push(currentElement);
            return;
        }
        linkIndex = output[lastOutputIndex].push(currentElement) - 1;
        linkCount++;
        const cacheOptions = {
            index: lastOutputIndex,
            linkIndex,
            cell: prevCell
        };
        if (cache[currentElement]) {
            cache[currentElement].push(cacheOptions);
        } else {
            cache[currentElement] = [cacheOptions];
        }
        if (cacheLinkCount[prevCell]) {
            cacheLinkCount[prevCell]++;
        } else {
            cacheLinkCount[prevCell] = 1;
        }
    }
    const inputLength = input.length;
    for (let i = 0; i < inputLength; i++) {
        const currentChar = input[i];
        prevCell = currentCell;
        const isSeparator = /[\n,]/.test(currentChar);
        const isEnd = i === inputLength - 1;
        // const isSpace = /[ ]/.test(currentChar);
        // const isOperator = /[/+-\\*]/.test(currentChar);
        if (/[\n]/.test(currentChar)) {
            currentRow++;
            currentColumn = initialColumn;
            currentCell = currentColumn + currentRow;
        }
        if (/[,]/.test(currentChar)) {
            currentColumn = String.fromCharCode(currentColumn.charCodeAt(0) + 1);
            currentCell = currentColumn + currentRow;
        }
        if (isSeparator) {
            switch (status) {
                case 'space':
                    break;
                case 'link':
                    cacheLink(lastOutputIndex, currentElement);
                    break;
                default:
                    output[lastOutputIndex].push(currentElement);
            }
        }
        if (status !== 'error') {
            if (currentChar === ' ') {
                switch (status) {
                    case 'operator':
                        status = 'space';
                        output[lastOutputIndex].push(currentElement);
                        operatorCount++;
                        break;
                    case 'operand':
                        status = 'space';
                        output[lastOutputIndex].push(+currentElement);
                        operandCount++;
                        break;
                    case 'space':
                        break;
                    case 'link':
                        if (currentElement.length === 1) {
                            output[lastOutputIndex] = '#ERR';
                            status = 'error';
                        } else {
                            cacheLink(lastOutputIndex, currentElement);
                            status = 'space';
                        }
                        break;
                }
            }
            if (currentChar >= 'a' && currentChar <= 'z') {
                switch (status) {
                    case 'operator':
                        status = 'link';
                        output[lastOutputIndex].push(currentElement);
                        operatorCount++;
                        currentElement = currentChar;
                        break;
                    case 'operand':
                        output[lastOutputIndex] = '#ERR';
                        status = 'error';
                        break;
                    case 'space':
                        currentElement = currentChar;
                        status = 'link';
                        break;
                    case 'link':
                        output[lastOutputIndex] = '#ERR';
                        status = 'error';
                        break;
                }
            }
            if (currentChar >= '1' && currentChar <= '9') {
                switch (status) {
                    case 'operator':
                        output[lastOutputIndex].push(currentElement);
                        operatorCount++;
                        currentElement = currentChar;
                        status = 'operand';
                        break;
                    case 'operand':
                        currentElement += currentChar;
                        break;
                    case 'space':
                        status = 'operand';
                        currentElement = currentChar;
                        break;
                    case 'link':
                        currentElement += currentChar;
                        break;
                }
            }
            if (currentChar.search(/[/*+-]/) === 0) {
                switch (status) {
                    case 'operator':
                        output[lastOutputIndex].push(currentElement);
                        operatorCount++;
                        currentElement = currentChar;
                        status = 'operator';
                        break;
                    case 'operand':
                        output[lastOutputIndex].push(+currentElement);
                        operandCount++;
                        currentElement = currentChar;
                        status = 'operator';
                        break;
                    case 'space':
                        currentElement = currentChar;
                        status = 'operator';
                        break;
                    case 'link':
                        cacheLink(lastOutputIndex, currentElement);
                        currentElement = currentChar;
                        status = 'operator';
                        break;
                }
            }
            if (isEnd) {
                output[lastOutputIndex].push(currentElement);
            }
        }
        if (isSeparator || isEnd) {
            if (Array.isArray(output[lastOutputIndex])) {
                console.log(output[lastOutputIndex]);
                if (linkCount === 0) {
                    const value = (output[lastOutputIndex] = postFixExec(output[lastOutputIndex]));
                    map[prevCell] = output[lastOutputIndex];
                    updateLinks(prevCell);
                }
            }
        }
        if (isSeparator) {
            operatorCount = 0;
            operandCount = 0;
            linkCount = 0;
            status = 'space';
            output.push(currentChar);
            lastOutputIndex = output.push([]) - 1;
        }
    }
    return output.join('');
}
exports.default = parser;