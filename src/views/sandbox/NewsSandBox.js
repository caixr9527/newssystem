import React from 'react';
import TopHeader from "../../component/TopHeader";
import SideMenu from "../../component/SideMenu";
import {Outlet} from "react-router-dom";
import {Layout, theme} from "antd";
import './NewsSandBox.css'

const {Content} = Layout



function NewsSandBox(props) {
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    return (
        <Layout>
            <SideMenu></SideMenu>
            <Layout>
                <TopHeader></TopHeader>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        overflow: "auto"
                    }}
                >
                    <Outlet></Outlet>
                </Content>

            </Layout>

        </Layout>
    );
}

export default NewsSandBox;