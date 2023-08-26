import React, {useState} from 'react';
import {Button, Dropdown, Layout, Space, theme, Avatar} from "antd";
import type {MenuProps} from 'antd';
import {MenuFoldOutlined, MenuUnfoldOutlined, DownOutlined, UserOutlined} from '@ant-design/icons';
import {useNavigate} from "react-router-dom";


const {Header} = Layout;

function TopHeader(props) {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate()
    const {
        token: {colorBgContainer},
    } = theme.useToken();
    const {role: {roleName}, username} = JSON.parse(localStorage.getItem("token"))

    const items: MenuProps['items'] = [
        {
            label: '退出',
            key: '-1',
        }
    ];
    const onClick: MenuProps['onClick'] = ({key}) => {
        if (key === '-1') {
            localStorage.removeItem('token')
            navigate("/login")
        }
    };

    return (
        <Header style={{padding: 0, background: colorBgContainer}}>
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />
            <div style={{float: "right"}}>
                <span style={{padding:"10px"}}>欢迎【{roleName}】<span style={{color:"#1890ff",padding:"5px"}}>{username}</span>回来!</span>
                <Dropdown menu={{items, onClick}}>
                    {/*<a onClick={(e) => e.preventDefault()}>*/}
                        <Space>
                            <Avatar size="large" icon={<UserOutlined/>}/>
                        </Space>
                    {/*</a>*/}
                </Dropdown>
            </div>
        </Header>
    );
}

export default TopHeader;