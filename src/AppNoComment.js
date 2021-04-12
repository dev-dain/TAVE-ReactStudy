import React from 'react';
import axios from 'axios';

import './App.css';
import { ReactComponent as Check } from './check.svg';
import { css } from 'styled-components';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(
    () => localStorage.setItem(key, value),
    [value, key]
  );

  return [value, setValue];
}

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT': 
      return {
        ...state, 
        isLoading: true,
        isError: false
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case 'STOIRES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true
      }
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



// 컴포넌트
function InputWithLabel(props) {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (props.isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [props.isFocused]);

  console.log(inputRef.current);


  return (
    <React.Fragment>
      <label htmlFor={props.id} className="label">
        {props.children}
      </label>
      &nbsp;
      <input
        ref={inputRef}
        id={props.id}
        type={props.type || 'text'}
        value={props.value}
        onChange={props.onInputChange}
        className="input"
      />
    </React.Fragment>
  );
}


const Item = ({ item, onRemoveItem }) => {
  return (
    <div className="item">
      <span style={{ width: '40%' }}>
        <a href={item.url}>{item.title}</a>
      </span>
      <span style={{ width: '30%' }}>{item.author}</span>
      <span style={{ width: '10%' }}>{item.num_comments}</span>
      <span style={{ width: '10%' }}>{item.points}</span>
      <span style={{ width: '10%' }}>
        <button 
          type="button" 
          onClick={() => onRemoveItem(item)}
          className="button button_small"
        >
          <Check height="18px" width="18px" />
        </button>
      </span>
    </div>
  )
};

const List = ({ list, onRemoveItem }) =>
  list.map(item =>
    <Item 
      key={item.objectID} 
      item={item} 
      onRemoveItem={onRemoveItem}
    />
  );


const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit
}) => (  
  <form onSubmit={onSearchSubmit} className="search-form">
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
      <strong>Search: </strong>
    </InputWithLabel>

    <button 
      type="submit" 
      disabled={!searchTerm}
      className="button button_large"
    >
      Submit
    </button>
  </form>
);

<button
  type="submit"
  disabled={!searchTerm}
  className={cs(styles.button, styles.buttonLarge)}
>
  Submit
</button>



function App() {
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    ''
  );

  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);
  
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );


  const handleSearchInput = event => setSearchTerm(event.target.value);

  const handleSearchSubmit = event => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  }

  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item
    });
  }

  const handleFetchStories = React.useCallback(async() => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    try {
      const result = await axios.get(url);

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits
      })
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);


  
  return (
    <div className="container">
      <h1 className="headline-primary">
        My Hacker Stories
      </h1>
      
      {/* 검색창과 버튼 */}
      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      {stories.isError && <p> Something went wrong... </p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List 
          list={stories.data} 
          onRemoveItem={handleRemoveStory}/>
      )}
    </div>
  );
}



export default App;