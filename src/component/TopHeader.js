import React, {useState} from 'react';
import {Button, Dropdown, Layout, Space, theme, Avatar} from "antd";
import type { MenuProps } from 'antd';
import {MenuFoldOutlined, MenuUnfoldOutlined, DownOutlined, UserOutlined} from '@ant-design/icons';


const { Header} = Layout;

function TopHeader(props) {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    const items: MenuProps['items'] = [
        {
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                    1st menu item
                </a>
            ),
            key: '0',
        },
        {
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    2nd menu item
                </a>
            ),
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label: '3rd menu item（disabled）',
            key: '3',
            disabled: true,
        },
    ];

    return (
        <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />
            <div style={{float:"right"}}>
                <span>欢迎admin回来</span>
                <Dropdown menu={{ items }}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <Avatar size="large" icon={<UserOutlined />} />
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            </div>
        </Header>
    );
}

export default TopHeader;