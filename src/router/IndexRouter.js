import React, {useEffect, useState} from 'react';
import Login from "../views/login/Login";
import NewsSandBox from "../views/sandbox/NewsSandBox";
import {Navigate, Route, Routes} from "react-router-dom";
import Home from "../views/sandbox/home/Home";
import UserList from "../views/sandbox/user-manage/UserList";
import RightList from "../views/sandbox/right-manage/right/RightList";
import RoleList from "../views/sandbox/right-manage/role/RoleList";
import NotFound from "../views/404/NotFound";
import NewsAdd from "../views/sandbox/news-manage/NewsAdd";
import NewsDraft from "../views/sandbox/news-manage/NewsDraft";
import NewsCategory from "../views/sandbox/news-manage/NewsCategory";
import Audit from "../views/sandbox/audit-manage/Audit";
import AuditList from "../views/sandbox/audit-manage/AuditList";
import Unpublished from "../views/sandbox/publish-manage/Unpublished";
import Published from "../views/sandbox/publish-manage/Published";
import Sunset from "../views/sandbox/publish-manage/Sunset";
import axios from "axios";

const LocalRouterMap = {
    "/home": <Home/>,
    "/user-manage/list": <UserList/>,
    "/right-manage/role/list": <RoleList/>,
    "/right-manage/right/list": <RightList/>,
    "/news-manage/add": <NewsAdd/>,
    "/news-manage/draft": <NewsDraft/>,
    "/news-manage/category": <NewsCategory/>,
    "/audit-manage/audit": <Audit/>,
    "/audit-manage/list": <AuditList/>,
    "/publish-manage/unpublished": <Unpublished/>,
    "/publish-manage/published": <Published/>,
    "/publish-manage/sunset": <Sunset/>,

}

function IndexRouter(props) {

    const [BackRouteList, setBackRouteList] = useState([])
    useEffect(() => {
        Promise.all([
            axios.get("http://localhost:5000/rights"),
            axios.get("http://localhost:5000/children"),
        ]).then(res => {
            setBackRouteList([...res[0].data, ...res[1].data])
        })
    }, [])

    return (
        <Routes>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/" element={
                <AuthComponent>
                    <NewsSandBox/>
                </AuthComponent>
            }>
                {
                    BackRouteList.map((item, index) => {
                        return (
                            <Route key={index}
                                   exact
                                   path={item.key}
                                   element= {<AuthComponent> {LocalRouterMap[item.key]} </AuthComponent>}
                            />
                        );
                    })
                }
                BackRouteList.length>0 && <Route path="*" element={<NotFound/>}></Route>
            </Route>

        </Routes>
    );
}

function AuthComponent({children}) {
    return localStorage.getItem("token") ? children : <Navigate to="/login"/>
}

export default IndexRouter;