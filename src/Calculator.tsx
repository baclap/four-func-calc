import React, { useState } from 'react';
import './Calculator.css';

function Calculator() {
  const [displayValue, setDisplayValue] = useState('0');
  const [prevFloat, setPrevFloat] = useState(0);
  const [prevOperation, setPrevOperation] = useState('=');
  const [isDisplayResetPending, setIsDisplayResetPending] = useState(false);

  const handleInputClick = (input: string) => {
    // like iPhone, don't allow user to enter more than 9 digits
    if (numDigits(displayValue) >= 9 && !isDisplayResetPending) {
      return;
    }

    let value = displayValue;
    // an operation was just selected, the next input should start a new value
    if (isDisplayResetPending) {
      value = '0';
      setIsDisplayResetPending(false);
      // save the prior value for the upcoming calculation
      setPrevFloat(asFloat(displayValue));
    }

    if (input === '.') {
      if (value.includes('.')) {
        return;
      }
      setDisplayValue(`${value}.`);
      return;
    }

    setDisplayValue(formatForDisplay(asFloat(`${value}${input}`)));
  }

  const handleOperationClick = (operation: string) => {
    // happens in cases where user selects one operation then immediately changes to a different operation
    if (isDisplayResetPending) {
      setPrevOperation(operation);
      return;
    }

    let value = prevFloat;
    if (prevOperation != '=') {
      switch(prevOperation) {
        case '+':
          value += asFloat(displayValue);
          break;
        case '-':
          value -= asFloat(displayValue);
          break;
        case '*':
          value *= asFloat(displayValue);
          break;
        case '/':
          value /= asFloat(displayValue);
          break;
      }
      setDisplayValue(formatForDisplay(value));
    }

    setIsDisplayResetPending(true);
    setPrevOperation(operation);
  }
  
  const clear = () => {
    setDisplayValue('0');
    setPrevFloat(0);
    setPrevOperation('=');
    setIsDisplayResetPending(false);
  }

  return (
    <div className="Calculator">
      {/* row */}
      <div className="num-display">{displayValue}</div>
      {/* row */}
      <Button operation className="clear-btn" onClick={clear}>C</Button>
      <Button operation className="equal-btn" onClick={() => handleOperationClick('=')}>=</Button>
      {/* row */}
      <Button input className="seven-btn" onClick={() => handleInputClick('7')}>7</Button>
      <Button input className="eight-btn" onClick={() => handleInputClick('8')}>8</Button>
      <Button input className="nine-btn" onClick={() => handleInputClick('9')}>9</Button>
      <Button operation isPending={prevOperation === '+' && isDisplayResetPending} className="plus-btn" onClick={() => handleOperationClick('+')}>+</Button>
      {/* row */}
      <Button input className="four-btn" onClick={() => handleInputClick('4')}>4</Button>
      <Button input className="five-btn" onClick={() => handleInputClick('5')}>5</Button>
      <Button input className="six-btn" onClick={() => handleInputClick('6')}>6</Button>
      <Button operation isPending={prevOperation === '-' && isDisplayResetPending} className="minus-btn" onClick={() => handleOperationClick('-')}>-</Button>
      {/* row */}
      <Button input className="one-btn" onClick={() => handleInputClick('1')}>1</Button>
      <Button input className="two-btn" onClick={() => handleInputClick('2')}>2</Button>
      <Button input className="three-btn" onClick={() => handleInputClick('3')}>3</Button>
      <Button operation isPending={prevOperation === '*' && isDisplayResetPending} className="multiply-btn" onClick={() => handleOperationClick('*')}>*</Button>
      {/* row */}
      <Button input className="zero-btn" onClick={() => handleInputClick('0')}>0</Button>
      <Button input className="decimal-btn" onClick={() => handleInputClick('.')}>.</Button>
      <Button operation isPending={prevOperation === '/' && isDisplayResetPending} className="divide-btn" onClick={() => handleOperationClick('/')}>/</Button>
    </div>
  );
}

export default Calculator;

const Button = ({
  input,
  operation,
  isPending,
  className,
  onClick,
  children
}: {
  input?: boolean,
  operation?: boolean,
  isPending?: boolean,
  className: string,
  onClick: () => void,
  children: string
}) => <button
  className={`${className} ${input ? 'input-btn' : ''} ${operation ? 'operation-btn' : ''} ${isPending ? 'pending' : ''}`}
  onClick={onClick}
>{children}</button>;

const numDigits = (str: string) => str.replace(/[ ,.]/g, '').length;
const asFloat = (str: string) => parseFloat(str.replace(/[ ,]/g, ''));
const formatForDisplay = (num: number) => {
  if (num > 999999999) {
    return num.toExponential()
  }
  return num.toLocaleString('en-US', {
    maximumSignificantDigits: 9,
    maximumFractionDigits: 9
  });
}
