import { getOrderByNumberApi } from '../../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TOrderState = {
  orders: TOrder[];
  orderByNumberResponse: TOrder | null;
  request: boolean;
  error: string | null;
};

export const initialState: TOrderState = {
  orders: [],
  orderByNumberResponse: null,
  request: false,
  error: null
};

export const getOrderByNumber = createAsyncThunk<TOrder, number>(
  'order/byNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    if (!response.orders || !response.orders[0]) {
      throw new Error('Order not found');
    }
    return response.orders[0];
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  selectors: {
    getOrderState: (state: TOrderState) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderByNumber.pending, (state) => {
        state.error = null;
        state.request = true;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.error = action.error.message || 'Order error';
        state.request = false;
      })
      .addCase(
        getOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.error = null;
          state.request = false;
          state.orderByNumberResponse = action.payload;
        }
      );
  }
});

export const { getOrderState } = orderSlice.selectors;
export default orderSlice.reducer;
