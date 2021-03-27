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

  // useState와 useEffect 문장을 선언함. (아직 호출 전)
  // useState마냥 [상태, 상태 업데이트 함수 return]
  // 커스텀 훅은 use-접두사를 쓰고, 반환 값은 배열임
  // 이름 조정 이유는 62쪽
  const useSemiPersistentState = (key, initialState) => {
    // state와 상태 업데이트함수를 쌍으로 반환하는 useState 훅
    const [value, setValue] = React.useState(
      localStorage.getItem(key) || initialState
    );    

    // 키가 외부에서 오기 때문에 키가 변경될 수도 있으므로
    // key값이 변하면 useEffect가 새롭게 실행돼야 함
    React.useEffect(
      () => localStorage.setItem(key, value),
      [value, key]
    );

    return [value, setValue];
  }

  // key와 initialState를 보내고 상태와 상태 업데이트 함수를 받아옴
  // 내가 key값을 달리 주면 로컬 스토리지에 뭐가 있느냐에 따라 초기 value는 달라질 수 있음
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search', 
    'React'
  );

  const handleSearch = event => setSearchTerm(event.target.value);

  // searchedStories는 배열임
  // 어떻게 호출 없이 그냥 searchTerm이 바뀌는 걸 보고 매번 실행되는 걸까?
  // 그건 includes 내에서 searchTerm을 쓰기 때문에
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
      {/* Search 컴포넌트가 진짜 Search하는 게 아니라서 이름을 바꿈.
        대신 id와 label로 이게 뭐에 쓰려는 건지를 밝힘 
        type을 바꿔 쓸 수도 있게 하기 위해 (ex. number, email) type도 넘김 

        인데 '리액트 컴포넌트 구성'에서 type이랑 label을 빼버림
        label prop을 사용하는 대신 컴포넌트 엘리먼트 태그 사이에 'Search' 텍스트 삽입
        이것은 InputWithLabel에서 children prop으로 사용 가능 */}
      <InputWithLabel 
        id="search"
        value={searchTerm} 
        isFocused // === isFocused={true}
        onInputChange={handleSearch}
      >
        <strong>Search: </strong>
      </InputWithLabel>
      <hr />
      
      <List list={searchedStories}/>
    </div>
    // null  //null을 return하면 오류는 나지 않지만 빈 페이지가 나옴
  );
}

function InputWithLabel(props) {
  // https://react.vlpt.us/basic/10-useRef.html
  // 특정 DOM 선택해야 할 때 useRef와 ref 사용 
  // ref 객체를 만들고, 이 객체를 우리가 선택하고 싶은 DOM에 ref 값으로 설정해줘야 함
  // 즉, <input ref={inputRef}> 이렇게 넘겨야 한다는 뜻
  // 그럼 ref.current는 이 DOM을 가리키게 됨

  // ref 생성
  // ref 개체는 생명주기 동안 그대로 유지되는 지속적인 값
  // ref 개체와 달리 변경될 수 있는 current가 프로퍼티로 포함됨

  // useRef는 .current 프로퍼티로 전달된 기본값(여기서는 X)로 초기화된
  // 변경 가능한 ref 객체를 반환함
  // ref 객체는 컴포넌트 전 생애주기 동안 유지됨
  
  // useRef는 .current 프로퍼티에 변경 가능한 값을 담은 컨테이너와 같음
  // useRef는 매번 렌더링을 할 때 동일한 ref 객체 제공
  // current 프로퍼티를 변경한다고 리렌더링이 발생되지는 않음
  const inputRef = React.useRef();

  // useEffect 종속성 배열 원소는 꼭 상태가 아니어도 됨?
  React.useEffect(() => {
    if (props.isFocused && inputRef.current) {
      inputRef.current.focus(); //focus()가 DOM API
    }
  }, [props.isFocused]);

  console.log(inputRef.current);


  return (
  // <React.Fragment>를 쓰면 같은 레벨에서 사용 가능
  // return은 루트 컴포넌트 안에 하위 태그들을 넣어야지
  // 루트 컴포넌트가 2개 이상 있으면 X
  // event.target(input#search).value로 input값 접근 가능    
    <React.Fragment>
      <label htmlFor={props.id}>{props.children}</label>
      &nbsp;
      {/* ref가 JSX로 지정한 입력 필드의 ref 속성으로 전달
        엘리먼트 인스턴스는 변경 가능한 current 속성에 할당 */}
      <input 
        ref={inputRef}
        id={props.id}
        type={props.type || 'text'}
        value={props.value}
        // 엄밀히 말하면 상태값은 Search 컴포넌트에서 바꾸는 것이 아님
        // input 값을 바꾸면 setSearchTerm이 실행되면서 거기서 바뀌는 것임
        // 트리거 역할을 하는 것
        
        //input에 onchange 프로퍼티가 원래 있긴 한데
        //onchange=javascript function 이런 식으로 씀
        onChange={props.onInputChange} 
        // 이렇게 되면 여러 InputWithLabel이 렌더링됐을 때
        // 마지막 InputWithLabel에만 포커스가 주어짐
        // autoFocus //선언형 방법.
        // autoFocus={props.isFocused}
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