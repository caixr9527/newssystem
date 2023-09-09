import {combineReducers, legacy_createStore} from "redux";
import {CollapsedReducer} from "../reducers/CollapsedReducer";
import {LoadingReducer} from "../reducers/LoadingReducer";

import {persistStore, persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web


const persistConfig = {
    key: 'caixr',
    storage,
    blacklist: ['LoadingReducer']
}

const reducer = combineReducers({
    CollapsedReducer,
    LoadingReducer
})

const persistedReducer = persistReducer(persistConfig, reducer)

const store = legacy_createStore(persistedReducer);
const persistor = persistStore(store)
export {
    store,
    persistor
}
