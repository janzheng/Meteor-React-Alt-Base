import ReactDOM from 'react-dom';

export const getInputValue = (component) => ReactDOM.findDOMNode(component).value;

// this looks crazy, but it's because of bootstrap
export const getIsChecked = (component) => ReactDOM.findDOMNode(component).getElementsByTagName('input')[0].checked;