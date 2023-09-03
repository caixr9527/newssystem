import React from 'react';
import {Button, Form, Input, message} from 'antd';
import {useNavigate} from "react-router-dom";
import './Login.css'
import axios from "axios";

function Login(props) {
    const navigate = useNavigate()

    const onFinish = (values: any) => {
        axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`)
            .then(res => {
                console.log(res.data)
                if (res.data.length === 0) {
                    message.error("用户名或密码不存在")
                } else {
                    localStorage.setItem("token", JSON.stringify(res.data[0]))
                    navigate("/")
                }
            })
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div style={{background: 'rgb(35,39,65)', height: "100%", overflow: "hidden"}}>
            <div className="formContainer">
                <div className="loginTitle">全球新闻发布管理系统</div>
                <Form
                    name="basic"
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    style={{maxWidth: 600}}
                    initialValues={{remember: true}}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[{required: true, message: '输入用户名！'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[{required: true, message: '输入密码！'}]}
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item wrapperCol={{offset: 8, span: 16}}>
                        <Button type="primary" htmlType="submit">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
        ;
}

export default Login;