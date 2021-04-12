import React from 'react';
const searchReducer = (state, action) => {
  if (action.type === 'SET_SEARCH') 
    return action.payload;
  else 
    throw new Error();
};

const App2 = () => {
  const [search, dispatchSearch] = React.useReducer(
    searchReducer,
    ''
  );

  React.useEffect(() => {
    console.log(search)
  }, [search]);

  const handleInput = e => 
    dispatchSearch({
      type: 'SET_SEARCH',
      payload: e.target.value
    });

  const inputRef = React.useRef();
  React.useEffect(() => inputRef.current.focus(), []);

  return (
    <>
      <input onChange={handleInput} ref={inputRef} autoFocus/>
      <p>{search}</p>
    </>
  )
}
export default App2;