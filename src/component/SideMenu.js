import React, {useEffect, useState} from 'react';
import type {MenuProps} from 'antd';
import {Layout, Menu} from "antd";
import './index.css'
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";

type MenuItem = Required<MenuProps>['items'][number];
const {Sider} = Layout

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

function SideMenu(props) {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate()
    const location = useLocation();
    const [menuItem, setMenuItem] = useState([])

    useEffect(() => {
        axios.get("http://localhost:5000/rights?_embed=children").then(res => {
            setMenuItem(getMenuItem(res.data))
        })
    }, [])
    const checkPagePermission = (item) => {
        return item.pagepermisson != null && item.pagepermisson === 1
    }

    const getMenuItem = (data) => {
        if (data === null) {
            return null
        }
        if (!Array.isArray(data)) {
            return null;
        }
        let result = []
        for (let i = 0; i < data.length; i++) {
            let d = data[i];
            if (!checkPagePermission(d)) {
                continue
            }
            let item = getItem(d.title, d.key)
            result.push(item);
            item['children'] = getMenuItem(d.children)
        }
        return result.length === 0 ? null : result
    }
    const defaultSelectedKeys = [location.pathname]
    const defaultOpenKeys = ["/" + location.pathname.split("/")[1]]
    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <div style={{display: "flex", height: "100%", flexDirection: "column"}}>
                <div className="logo">全球新闻发布管理系统</div>
                <div style={{flex: 1, overflow: "auto"}}>
                    <Menu
                        theme="dark"
                        mode="inline"
                        items={menuItem}
                        defaultSelectedKeys={defaultSelectedKeys}
                        defaultOpenKeys={defaultOpenKeys}
                        onClick={(item) => {
                            navigate(item.key)
                        }}
                    />
                </div>
            </div>
        </Sider>
    );
}

export default SideMenu;