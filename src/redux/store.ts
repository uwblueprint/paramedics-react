import { applyMiddleware, createStore, combineReducers } from "redux";
import thunk from "redux-thunk";

export const initStore = (initialState: Object = {}) => {
  // Place all reducers here
  const reducers = combineReducers({});
  const store = createStore(reducers, initialState, applyMiddleware(thunk));
  return store;
};
