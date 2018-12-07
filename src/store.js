import reduxThunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import reducers from "./reducers";

export default createStore(reducers, {}, applyMiddleware(reduxThunk));
