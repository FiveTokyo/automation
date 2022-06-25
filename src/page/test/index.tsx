import { Key, ReactChild, ReactFragment, ReactPortal, useState } from 'react';
// 引入相关的hooks
import { useSelector, useDispatch } from 'react-redux';
// 引入对应的方法
import {
  increment,
  decrement,
  asyncIncrement,
} from '../../store/features/counterSlice';
import { getMovieData } from '../../store/features/movieSlice';
import logo from './logo.svg';
function App() {
  // 通过useSelector直接拿到store中定义的value
  const { value } = useSelector((store: any) => store.counter);
  // 通过useSelector直接拿到store中定义的list
  const { list } = useSelector((store: any) => store.movie);
  // 通过useDispatch 派发事件
  const dispatch = useDispatch();
  // 变量
  const [amount, setAmount] = useState(1);
  return (
    <div className="App">
      <header className="App-header">
        {/* 页面中应用的代码 */}
        <p>{value}</p>
        <input value={amount} onChange={(e) => setAmount(+e.target.value)} />
        <button
          onClick={() => {
            dispatch(increment({ value: amount }));
          }}
        >
          加
        </button>
        <button
          onClick={() => {
            dispatch(asyncIncrement());
          }}
        >
          异步加
        </button>
        <button
          onClick={() => {
            dispatch(decrement());
          }}
        >
          减
        </button>
        <button
          onClick={() => {
            dispatch(getMovieData() as any);
          }}
        >
          获取数据
        </button>
        <ul>
          {list.map((item: { tvId: Key | null | undefined; name: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined; }) => {
            return <li key={item.tvId}> {item.name}</li>;
          })}
        </ul>
      </header>
    </div>
  );
}

export default App;
