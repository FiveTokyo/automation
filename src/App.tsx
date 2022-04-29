import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [first, setfirst] = useState<number>(0);
  const [second, setSecond] = useState<number>(0);

  const fn = async () => {
    setfirst(first + 1);
    // console.log('2:')
    // await fn1();
    // console.log('3:')
    // setSecond(second + 1);
  };

  const fn1 = async () => {
    setSecond(second + 1);
  };

  const changeNumber = async () => {
     await setfirst(first + 1);
    // console.log('1:')
    // await fn();
    // console.log('4:')
    // // setTimeout(() => {
    // //   setfirst(first + 1);
    // //   // await fn();
    // //   setSecond(second + 1);
    // // }, 1000);
     setfirst((n)=> n+ 1);
    // // // await fn();
    //  setSecond((n)=> n + 1);
  };

  const heihei = async () => {
    setfirst(first + 1);
     new Promise((resolve, reject) => {
      setfirst(first + 1);
      // new Promise((res, rej) => {
        
      //   // console.log('first1:', first)
      //   // console.log('second1:', second)
      //    setSecond((n) => n + 1);
        
      //   res('')
      // }).then((res) => {
      //   // console.log('first2:', first)
      //   // console.log('second2:', second)
      //    setSecond((n) => n + 1);
        
        resolve('heihei');
      // });
      
    }).then((res) => {
      // console.log('first3:', first)
      // console.log('second3:', second)
      setfirst((n) => n + 1);
      // // await fn();
      setSecond(second + 1);
      
    });
  };

  console.log('render:', first, second);
  return (
    <div className="App">
      <header className="App-header" onClick={heihei}>
        {first}
        {second}
      </header>
    </div>
  );
}

export default App;
