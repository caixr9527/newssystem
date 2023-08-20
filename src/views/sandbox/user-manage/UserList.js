import React, {useEffect, useState} from 'react';
import {Button, Switch, Table} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import axios from "axios";

function UserList(props) {
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/users?_expand=role")
            .then(res => {
                console.log(res.data)
                setDataSource(res.data)
            })
    }, [])

    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            render: (region) => {
                return <b>{region === "" ? '全球' : region}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render: (role) => {
                return role?.roleName
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '用户状态',
            render: (item) => {
                return <Switch checkedChildren="开启" unCheckedChildren="关闭"
                               checked={item.roleState}
                               onClick={() => switchMethod(item)}/>

            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger
                            shape="circle"
                            icon={<DeleteOutlined/>}
                            onClick={() => {
                            }}/>
                    <Button type="primary" s
                            hape="circle"
                            icon={<EditOutlined/>}
                            onClick={() => {

                            }}/>
                </div>
            }
        },
    ]

    const switchMethod = (item) => {
        console.log(typeof item.default)
        console.log(typeof item.roleState)
    }
    return (
        <div>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowKey={(item) => item.id}
                pagination={{
                    pageSize: 5
                }}/>
        </div>
    );
}

export default UserList;