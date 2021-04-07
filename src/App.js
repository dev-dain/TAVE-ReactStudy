import React from 'react';

function getTitle(title) {
  return title;
}

const initialStories = [
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

// 요청이 성공하면 데이터를 반환하는 프로미스 반환 함수 생성
// 요청이 처리된 객체는 이전 스토리 목록을 갖고 있음
// (???) 프로미스 알아보자
const getAsyncStories = () =>
  // Promise.resolve({ data: { stories: initialStories } });

  // new Promise(resolve => 
  //   setTimeout(
  //     () => resolve({ data: { stories: initialStories } }),
  //     2000
  //   ) // 2초 지연
  // );

  // 일부러 에러 만들기
  new Promise((resolve, reject) => setTimeout(reject, 2000));




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

const storiesReducer = (state, action) => {
  switch (action.type) {
    // 처음 렌더링 시 최초 1회. 현재 data는 비어 있는 채로 놔두는 게 맞음
    case 'STORIES_FETCH_INIT': 
      return {
        ...state, //전개연산자. state는 data, isLoading, isError 프로퍼티를 가진 객체임
        isLoading: true,
        isError: false
      };
    // 비동기 데이터 가져오기 성공
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    // 비동기 데이터 가져오기 실패. 오류
    case 'STOIRES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true
      }
    // initialStories에서 객체 지우기
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          story => action.payload.objectID !== story.objectID
        )
      };
    default:
      throw new Error();
  }
};

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

function App() {
  const title = [1, 2, 3, 4, 5];

  // key와 initialState를 보내고 상태와 상태 업데이트 함수를 받아옴
  // 내가 key값을 달리 주면 로컬 스토리지에 뭐가 있느냐에 따라 초기 value는 달라질 수 있음
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    ''
  );
  const handleSearch = event => setSearchTerm(event.target.value);

  // url도 상태로 만들어버림
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);
  const handleSearchInput = event => setSearchTerm(event.target.value);
  const handleSearchSubmit = () => setUrl(`${API_ENDPOINT}${searchTerm}`);

  // 외부의 initialStories가 stories 상태 초기값이 됨
  // -> '리액트 비동기 데이터' 장에서 빈 배열 사용으로 변경
  // const [stories, setStories] = React.useState([]);

  // useState를 useReducer로 교체해보기
  // 리듀서에 디스패치를 통해 action을 보냄.
  // action은 타입과 지정된 데이터와 함께 제공됨
  // 이 상태에서 이미 stories 상태는 { data, isLoading, isError } 프로퍼티를 가진 객체임
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );

  // '불가능한 상태' 챕터를 위해 isLoading과 isError를 reducer의 초기 상태로 통합함
  // 초기 상태는 꼭 배열이 아니어도 됨

  // // 로딩 중인지 보는 상태
  // const [isLoading, setIsLoading] = React.useState(false);
  // // 비동기 데이터에 오류가 있는지 보는 상태
  // const [isError, setIsError] = React.useState(false);


  // 종속성 배열이 비었기 때문에 컴포넌트 최초 렌더링 시 1회만 실행
  // getAsyncStories에서 반환받은 프로미스를 처리
  // setStories로 stories 상태를 result 결과로 업데이트
  const handleFetchStories = React.useCallback(() => {
    if (!searchTerm) return;  // 검색어 자리가 비었다면 그냥 끝

    // setIsLoading(true); // 최초 렌더링 시 로딩중 true
    // reducer에 맞게 고치기
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    // 기존 useState에서 쓰던 set 상태 업데이트 함수의
    // 새로운 상태 값은 dispatch 함수 매개변수 객체의 payload로 넣어줌

    fetch(url) //url 상태를 가져와서 검색
      .then(response => response.json())  // 응답을 JSON으로 변환
      .then(result => { //변환 후 dispatch 함수 호출, payload로 전달
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.hits
        });
      })
      .catch(() => 
        dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
      );

    /*
    getAsyncStories()
      .then(result => {
        // setStories(result.data.stories);
        // useReducer에 맞게 dispatch 함수 사용
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.data.stories
        });
        // setIsLoading(false);  // 프로미스 결과 받은 후에는 false
        
      })
      // .catch(() => setIsError(true));
      // 이처럼 payload를 안 줄 수도 있음. 하지만 type은 주어져야 함
      .catch(() => dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
      );
      */
  }, [url]);  // 종속성 배열에도 url 넣기

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]); // useEffect는 함수가 변경될 때마다 실행



  const handleRemoveStory = item => {
    // 상태(리스트).filter를 해서 newStories는 새로운 리스트가 됨
    // const newStories = stories.filter(
    //   // 이 때 story는 stories 내의 객체. 
    //   // 인자 objectID와 story objectID가 다르면,
    //   // 즉, 삭제하는 것과 objectID가 다른 것들만 담음
    //   story => item.objectID !== story.objectID
    // );
    // setStories(newStories);

    // 이것도 dispatch 함수 사용
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item
    });
  }

  // searchedStories는 배열임
  // 어떻게 호출 없이 그냥 searchTerm이 바뀌는 걸 보고 매번 실행되는 걸까?
  // 그건 includes 내에서 searchTerm을 쓰기 때문에
  // input 내용이 바뀌면 handleSearch 실행 이후 stories.filter가 2번 실행됨. 
  // 왜 2번일까?
  const searchedStories = stories.data.filter(
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

      <button
        type="button"
        disabled={!searchTerm}  // searchTerm이 비었다면 disabled true
        onClick={handleSearchSubmit}
      >
        Submit
      </button>

      <hr />

      {/* 만약 isError가 true라면 <p> Something went wrong...</p> 출력.
        Error가 아니라면 isError가 false라 JSX 내부 값이 {false}기 때문에 그냥 지나감 */}
      {stories.isError && <p> Something went wrong... </p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List 
          list={stories.data} 
          onRemoveItem={handleRemoveStory}/>
      )}
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
const List = ({ list, onRemoveItem }) =>
  /* key prop이 있어야 함. 콘솔을 살펴볼 것*/
  list.map(item =>
    <Item 
      key={item.objectID} 
      item={item} 
      onRemoveItem={onRemoveItem}
    />
  );

const Item = ({ item, onRemoveItem }) => {
  // 인라인 핸들러 방식이 아닌 props 콜백 핸들러 방식
  // const handleRemoveItem = () => onRemoveItem(item);

  // 인라인 핸들러 구현을 위해 bind를 쓸 수 있음
  // (???) bind 사용법
  // 
  return (
    <div>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        {/* 1. bind 사용
        <button type="button" onClick={onRemoveItem.bind(null, item)}> 
        */}
        {/* 2. 화살표 함수로 그냥 묶어주기 */}
        <button type="button" onClick={() => onRemoveItem(item)}>
          Dismiss
        </button>
      </span>
    </div>
  )
};

export default App;