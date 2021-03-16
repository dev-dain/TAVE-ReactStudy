import React from 'react';

function getTitle(title) {
  return title;
}

const list = [
  {
    title: 'React',
    url: 'https://reactjs.org',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1
  }
];

function App() {
  const title = [1, 2, 3, 4, 5];

  // JSX에서 자바스크립트는 { } 안에 쓸 수 있음
  return (
    <div>
      <h1>
        Hello {getTitle('React!')} {title}
        {/* 그냥 JS 배열 자체를 넣으면 배열 안의 요소가 다 붙어서 나옴*/}
      </h1>
      <Search />

      <hr />
      <List />
    </div>
  );
}

function Search() {
  // <React.Fragment>를 쓰면 같은 레벨에서 사용 가능
  // return은 루트 컴포넌트 안에 하위 태그들을 넣어야지
  // 루트 컴포넌트가 2개 이상 있으면 X
  // event.target(input#search).value로 input값 접근 가능
  const handleChange = event => console.log(event.target.value);

  // const handleChange = e => {
  //   const input = document.querySelector('input');
  //   console.log(input.value);
  // }

  //input에 onchange 프로퍼티가 원래 있긴 한데
  //onchange=javascript function 이런 식으로 씀
  return (
    <React.Fragment>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={handleChange}/>
    </React.Fragment>
    // <div>
    //   <label htmlFor="search">Search: </label>
    //   <input id="search" type="text" />
    // </div>
  );
}

// 컴포넌트 정의부
const List = () =>
  /* key prop이 있어야 함. 콘솔을 살펴볼 것*/
  list.map(item => (
    <div key={item.objectID}>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
    </div>
  ));

export default App;
