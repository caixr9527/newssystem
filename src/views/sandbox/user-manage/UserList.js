import React, {useEffect, useRef, useState} from 'react';
import {Button, Modal, Switch, Table} from "antd";
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import axios from "axios";
import UserForm from "../../../component/user-manage/UserForm";
import roleList from "../right-manage/role/RoleList";


const {confirm} = Modal

function UserList(props) {
    const [dataSource, setDataSource] = useState([]);
    const [region, setRegion] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const addUserForm = useRef(null)
    const updateUserForm = useRef(null)
    const [isUpdateDisable, setIsUpdateDisable] = useState(false);
    const [current, setCurrent] = useState(null)

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
            filters: [
                ...region.map(item => ({
                    text: item.title,
                    value: item.value
                })),
                {
                    text: "全球",
                    value: "全球"
                }
            ],
            onFilter: (value, item) => {
                if (value === "全球") {
                    return item.region === ""
                }
                return item.region === value
            },
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
                            onClick={() => confirmMethod(item)}
                    />
                    <Button type="primary"
                            shape="circle"
                            icon={<EditOutlined/>}
                            disabled={item.default}
                            onClick={() => handleUpdate(item)}/>
                </div>
            }
        },
    ]

    const switchMethod = (item) => {

        axios.patch(`http://localhost:5000/users/${item.id}`, {
            roleState: !item.roleState
        }).then(res => {
            item.roleState = !item.roleState
            setDataSource([...dataSource])
        })

    }

    const confirmMethod = (item) => {
        confirm({
            icon: <ExclamationCircleOutlined/>,
            content: "确认是否删除？",
            onOk() {
                console.log('OK');
                deleteMethod(item)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    async function handleUpdate(item) {
        if (item.roleId === 1) {
            setIsUpdateDisable(true)
        } else {
            setIsUpdateDisable(false)
        }
        setCurrent(item)
        await setIsUpdateOpen(true)
        await updateUserForm.current.setFieldsValue(item)
    }

    const deleteMethod = (item) => {
        axios.delete(`http://localhost:5000/users/${item.id}`).then(
            setDataSource(dataSource.filter(data => data.id !== item.id))
        )

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

    function updateUser() {
        updateUserForm.current.validateFields().then(value => {
            setIsUpdateOpen(false)
            axios.patch(`http://localhost:5000/users/${current.id}`,
                value
            ).then(
                setDataSource(dataSource.map(item => {
                    if (item.id === current.id) {
                        return {
                            ...item,
                            ...value,
                            // role: roleList.filter(data => data.id === value.roleId)[0]
                        }
                    }
                    return item
                }))
            )
            setIsUpdateDisable(!isUpdateDisable)

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


            <Modal
                open={isUpdateOpen}
                title="更新用户"
                okText="更新"
                cancelText="取消"
                onCancel={() => {
                    setIsUpdateOpen(false)
                    setIsUpdateDisable(!isUpdateDisable)
                }}
                onOk={() => updateUser()}
            >
                <UserForm regionList={region} roleList={roles} ref={updateUserForm} isUpdateDisable={isUpdateDisable}/>
            </Modal>
        </div>
    );
}

export default UserList;