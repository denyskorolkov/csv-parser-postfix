interface cacheItem {
  cell: string;
  index: number;
  linkIndex: number;
}

interface cache {
  [index: string]: cacheItem[];
}

interface map {
  [index: string]: string;
}

export default function parser(input: string) {
  let output: any = [[]];
  let lastOutputIndex: number = 0;
  let initialColumn: string = 'a';
  let initialRow: number = 1;

  let currentElement: string = '';

  let currentColumn: string = initialColumn;
  let currentRow: number = initialRow;
  let currentCell: string = currentColumn + currentRow;
  let prevCell: string;

  let status: 'operator' | 'operand' | 'link' | 'space' | 'error' = 'space';

  let operatorCount: number = 0;
  let operandCount: number = 0;
  let linkCount: number = 0;

  let linkIndex: number;

  const cache: cache = {};
  const map: map = {};
  const cacheLinkCount: any = {};

  function updateLinks(cell: string): void {
    if (cache[cell]) {
      cache[cell].forEach(item => {
        output[item.index][item.linkIndex] = +map[cell];

        if (!--cacheLinkCount[item.cell]) {
          map[item.cell] = output[item.index] = postFixExec(output[item.index]);

          updateLinks(item.cell);
        }
      });
    }

    map[prevCell] = output[lastOutputIndex];
  }

  function execByOperator(first: number, second: number, operator: string) {
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

  function postFixExec(input: string[]) {
    let output = 0;
    const stack = [];
    for (let i = 0; i < input.length; i++) {
      const current = input[i];
      let first: string | number;
      let second: string | number;
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

  function cacheLink(lastOutputIndex: number, currentElement: string) {
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
        if (linkCount === 0) {
          const value = (output[lastOutputIndex] = postFixExec(
            output[lastOutputIndex]
          ));
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
