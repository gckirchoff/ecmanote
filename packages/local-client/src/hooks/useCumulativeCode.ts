import { useTypedSelector } from './useTypedSelector';

export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]);

    const showFunction = `
    import _React from 'react';
    import _ReactDOM from 'react-dom';
    var num = 0;
    var getRoot = () => {
      let root = document.createElement("div");
      root.id = \`root\${num}\`;
      let body = document.querySelector('body');
      body.appendChild(root);
      num++;
      return root;
    };
    var show = (value) => {
      let root = getRoot();
      if (typeof value === 'object') {
        if (value.$$typeof && value.props) {
          _ReactDOM.render(value, root);
        } else {
          root.innerHTML = JSON.stringify(value);
        }
      } else {
        root.innerHTML = value;
      }
      console.log(num);
    };
  `;

    // import _React from 'react';
    // import _ReactDOM from 'react-dom';
    // var show = (value) => {
    //   const root = document.querySelector('#root');

    //   if (typeof value === 'object') {
    //     if (value.$$typeof && value.props) {
    //       _ReactDOM.render(value, root);
    //     } else {
    //       root.innerHTML = JSON.stringify(value);
    //     }
    //   } else {
    //     root.innerHTML = value;
    //   }
    // };

    const showFunctionNotOperational = `var show = () => {}`;
    const cumulativeCode = [];
    for (let myCell of orderedCells) {
      if (myCell.type === 'code') {
        if (myCell.id === cellId) {
          cumulativeCode.push(showFunction);
        } else {
          cumulativeCode.push(showFunctionNotOperational);
        }
        cumulativeCode.push(myCell.content);
      }
      // This breaks out of for loop when we get to current cell passed into CodeCell component.
      if (myCell.id === cellId) {
        break;
      }
    }
    return cumulativeCode;
  }).join('\n');
};
