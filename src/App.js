import React from 'react';

function getTitle(title) {
  return title;
}

function App() {
  const title = [1, 2, 3, 4, 5];

  const stories = [
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

  const [searchTerm, setSearchTerm] = React.useState('react');

  const handleSearch = event => setSearchTerm(event.target.value);

  // searchedStories는 배열임
  // 어떻게 호출 없이 그냥 searchTerm이 바뀌는 걸 보고 매번 실행되는 걸까?
  // input 내용이 바뀌면 handleSearch 실행 이후 stories.filter가 2번 실행됨. 
  // 왜 2번일까?
  const searchedStories = stories.filter(
    story => story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // JSX에서 자바스크립트는 { } 안에 쓸 수 있음
  return (
    <div>
      <h1>
        Hello {getTitle('React!')} {title}
        {/* 그냥 JS 배열 자체를 넣으면 배열 안의 요소가 다 붙어서 나옴*/}
      </h1>
      <Search search={searchTerm} onSearch={handleSearch}/>
      <hr />
      
      <List list={searchedStories}/>
    </div>
    // null  //null을 return하면 오류는 나지 않지만 빈 페이지가 나옴
  );
}

function Search(props) {
  // state와 상태 업데이트함수를 쌍으로 반환하는 useState 훅
  return (
  // <React.Fragment>를 쓰면 같은 레벨에서 사용 가능
  // return은 루트 컴포넌트 안에 하위 태그들을 넣어야지
  // 루트 컴포넌트가 2개 이상 있으면 X
  // event.target(input#search).value로 input값 접근 가능    
    <React.Fragment>
      <label htmlFor="search">Search: </label>
      <input 
        id="search" 
        type="text" 
        value={props.search}
        // 엄밀히 말하면 상태값은 Search 컴포넌트에서 바꾸는 것이 아님
        // input 값을 바꾸면 setSearchTerm이 실행되면서 거기서 바뀌는 것임
        // 트리거 역할을 하는 것
        
        //input에 onchange 프로퍼티가 원래 있긴 한데
        //onchange=javascript function 이런 식으로 씀
        onChange={props.onSearch} 
      />
    </React.Fragment>
  );
}

// 컴포넌트 정의부
// 인자 이름으로는 뭘 써도 괜찮음
const List = ({ list }) =>
  /* key prop이 있어야 함. 콘솔을 살펴볼 것*/
  list.map(item => 
    <Item key={item.objectID} item={item} />
  );

const Item = ({ item }) => {
  console.log(item);  // 객체로 나옴

  return (
    <div>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
    </div>
  )
};

export default App;