// 클래스형 컴포넌트와 함수형 컴포넌트 비교
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
      </h1>
      <Search />

      <hr />
      <List />
    </div>
  );
}

// 클래스형 컴포넌트
class Search extends React.Component {
  handleChange(event) {
    console.log(event.target.value);
  };

  render() {
    return (
      <React.Fragment>
        <label htmlFor="search">Search: </label>
        <input id="search" type="text" onChange={this.handleChange} />
      </React.Fragment>
    );
  };
}

// 함수형 컴포넌트
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