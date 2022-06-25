import { createSlice } from '@reduxjs/toolkit';

export interface CounterState {
  value: number;
  title: string;
}
const initialState: CounterState = {
  value: 0,
  title: 'redux toolkit pre',
};

// 创建一个 Slice
export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  // 定义 reducers 并生成关联的操作
  reducers: {
    increment: (state: { value: any; }, { payload }: any) => {
      // action 里面有 type 和 payload 两个属性，所有的传参都在payload里面
      state.value += payload.value;
    },
    // 定义一个减的方法
    decrement: (state: { value: number; }) => {
      state.value -= 1;
    },
    asyncIncrement: (state) => {
      // action 里面有 type 和 payload 两个属性，所有的传参都在payload里面
    },
    // 定义一个减的方法
  },
});
// 导出加减的方法
export const { increment, decrement, asyncIncrement } = counterSlice.actions;

// 默认导出
export default counterSlice.reducer;
