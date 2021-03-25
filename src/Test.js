// 출제를 위한 컴포넌트
import React from 'react';

const Test = () => {
  const [sum, setSum] = React.useState(0);
  console.log(typeof(sum));

  const addValue = () => {
    // 문서에서 'input' 태그를 찾아 input 상수에 할당합니다.
    const input = document.querySelector('input');
    setSum(sum + input.value);
    // setSum(sum + Number(input.value));
    input.value = '';
  }

  return (
    <div>
      <p>sum 값 : {sum}</p>
      {/* Count에 addValue를 'handler'라는 이름으로 넘겨줍니다. */}
      <Count handler={addValue} />
    </div>
  )
}

// props.handler로 쓰지 않고 그냥 handler로 쓸 수 있도록 매개변수 부분을 바꿔보세요.
const Count = ({handler}) => {
  return (
    <div>
      <input type="number"></input>
      <button onClick={handler}>합하기</button>
    </div>
  )
}

export default Test;