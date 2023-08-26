import React, {forwardRef, useEffect, useState} from 'react';
import {Form, Input, Select} from "antd";

const UserForm = forwardRef((props, ref) => {
    const [disableRegionSelect, setIsDisableRegionSelect] = useState(false);
    // const [form] = Form.useForm();
    useEffect(() => {
        setIsDisableRegionSelect(props.isUpdateDisable)
    }, [props.isUpdateDisable])

    const {roleId, region} = JSON.parse(localStorage.getItem("token"))
    const roleObj = {
        "1": "superadmin",
        "2": "admin",
        "3": "editor"
    }
    const checkRegionDisabled = (item) => {
        if (props.isUpdate) {
            return roleObj[roleId] !== "superadmin";
        }

    }

    return (
        <Form
            // form={form}
            ref={ref}
            layout="vertical"
        >
            <Form.Item
                name="username"
                label="用户名"
                rules={[{required: true, message: '请输入用户名!'}]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[{required: true, message: '请输入密码!'}]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={disableRegionSelect ? [] : [{required: true, message: '请选择区域!'}]}
            >
                <Select
                    showSearch
                    allowClear
                    style={{width: 240}}
                    onChange={(item) => {
                        console.log(item)
                    }}
                    options={props.regionList}
                    disabled={checkRegionDisabled()}
                />
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[{required: true, message: '请选择角色!'}]}
            >
                <Select
                    showSearch
                    allowClear
                    style={{width: 240}}
                    onChange={(id) => {
                        setIsDisableRegionSelect(id === 1)
                        id === 1 && ref.current.setFieldsValue({region: ''})
                    }}
                    options={props.roleList}
                />
            </Form.Item>
        </Form>
    );
})

export default UserForm;