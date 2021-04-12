import React from 'react';
import ReactDOM from 'react-dom'; //ReactDOM 사용을 위해 import
import './index.css';
import App from './App';
// import App2 from './App2';
import reportWebVitals from './reportWebVitals';

// ReactDOM.render() 메소드로 HTML DOM 노드를 JSX로 바꿈 -> 리액트를 HTML로 통합
//https://ko.reactjs.org/docs/strict-mode.html
// ReactDOM.render(JSX, HTML 위치);
ReactDOM.render(
  //StrictMode는 애플리케이션 내의 잠재적 문제를 알아내는 도구
  //애플리케이션 어디에서든지 strict 모드 활성화 가능
  //꼭 index.js나 render 함수 안이 아니더라도
  // <React.StrictMode>
    <App />,
  // </React.StrictMode>,
  document.getElementById('root')
  // public/index.html의 'root' id 엘리먼트를 App 컴포넌트로 대체
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
