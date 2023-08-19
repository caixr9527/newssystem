import React from 'react';
import Login from "../views/login/Login";
import NewsSandBox from "../views/sandbox/NewsSandBox";
import {Navigate, Route, Routes} from "react-router-dom";
import Home from "../views/sandbox/home/Home";
import UserList from "../views/sandbox/user-manage/UserList";
import RightList from "../views/sandbox/right-manage/right/RightList";
import RoleList from "../views/sandbox/right-manage/role/RoleList";
import NotFound from "../views/404/NotFound";

function IndexRouter(props) {
    return (
        <Routes>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/" element={
                <AuthComponent>
                    <NewsSandBox/>
                </AuthComponent>
            }>
                <Route path="/" element={<Navigate to="/home"/>}/>
                <Route path="/home" element={
                    <AuthComponent>
                        <Home/>
                    </AuthComponent>
                }></Route>
                <Route path="/user-manage/list" element={
                    <AuthComponent>
                        <UserList/>
                    </AuthComponent>
                }></Route>
                <Route path="/right-manage/role/list" element={
                    <AuthComponent>
                        <RoleList/>
                    </AuthComponent>
                }></Route>
                <Route path="/right-manage/right/list" element={
                    <AuthComponent>
                        <RightList/>
                    </AuthComponent>
                }></Route>
                <Route path="*" element={<NotFound/>}></Route>
            </Route>

        </Routes>
    );
}

function AuthComponent({children}) {
    return localStorage.getItem("token") ? children : <Navigate to="/login"/>
}

export default IndexRouter;