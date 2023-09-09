import React from 'react';
import TopHeader from "../../component/TopHeader";
import SideMenu from "../../component/SideMenu";
import {Outlet} from "react-router-dom";
import {Layout, Spin, theme} from "antd";
import './NewsSandBox.css'
import {connect} from "react-redux";

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
                    <Spin tip="加载中..." size="large" spinning={props.isLoading}>
                        <Outlet></Outlet>
                    </Spin>
                </Content>

            </Layout>


        </Layout>
    );
}

const mapStateToProps = ({LoadingReducer: {isLoading}}) => {
    return {
        isLoading
    }
}

export default connect(mapStateToProps)(NewsSandBox);