import React, {useEffect, useRef, useState} from 'react';
import {Button, Modal, Switch, Table} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import axios from "axios";
import UserForm from "../../../component/user-manage/UserForm";

function UserList(props) {
    const [dataSource, setDataSource] = useState([]);
    const [region, setRegion] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const addUserForm = useRef(null)


    useEffect(() => {
        axios.get("http://localhost:5000/users?_expand=role")
            .then(res => {
                console.log(res.data)
                setDataSource(res.data)
            })
    }, [])

    useEffect(() => {
        axios.get("http://localhost:5000/regions")
            .then(res => {
                res.data.forEach(item => {
                    item['label'] = item?.value
                })
                setRegion(res.data)
            })
    }, [])

    useEffect(() => {
        axios.get("http://localhost:5000/roles")
            .then(res => {

                res.data.forEach(item => {
                    item['title'] = item?.roleName
                    item['label'] = item?.roleName
                    item['value'] = item?.id
                })
                setRoles(res.data)
            })
    }, [])

    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            render: (region) => {
                return <b>{region === '' ? '全球' : region}</b>
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
                               disabled={item.default}
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
                            disabled={item.default}
                            onClick={() => {
                            }}/>
                    <Button type="primary"
                            shape="circle"
                            icon={<EditOutlined/>}
                            disabled={item.default}
                            onClick={() => {

                            }}/>
                </div>
            }
        },
    ]

    const switchMethod = (item) => {
    }

    function addUser() {
        console.log("add", addUserForm)
        addUserForm.current.validateFields().then(value => {
            console.log(value)
            setIsOpen(false)
            axios.post(`http://localhost:5000/users`, {
                ...value,
                "roleState": true,
                "default": false
            }).then(res => {
                setDataSource([...dataSource, res.data])
            })
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <div>
            <Button type="primary"
                    onClick={() => {
                        setIsOpen(true)
                    }}>添加用户</Button>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowKey={(item) => item.id}
                pagination={{
                    pageSize: 5
                }}/>

            <Modal
                open={isOpen}
                title="添加用户"
                okText="确定"
                cancelText="取消"
                onCancel={() => {
                    setIsOpen(false)
                }}
                onOk={() => addUser()}
            >
                <UserForm regionList={region} roleList={roles} ref={addUserForm}/>
            </Modal>
        </div>
    );
}

export default UserList;