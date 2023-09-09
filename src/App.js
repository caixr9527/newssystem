import React from 'react'
import IndexRouter from "./router/IndexRouter";
import {HashRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {persistor, store} from "./redux/store";
import {PersistGate} from "redux-persist/integration/react";

export default function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <HashRouter>
                    <IndexRouter/>
                </HashRouter>
            </PersistGate>
        </Provider>

    )
}


