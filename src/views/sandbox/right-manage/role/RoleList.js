import React, {useEffect, useState} from 'react';
import {Button, Modal, Table, Tree} from "antd";
import axios from "axios";
import {DeleteOutlined, ExclamationCircleOutlined, UnorderedListOutlined} from "@ant-design/icons";

const {confirm} = Modal

function RoleList(props) {
    const [dataSource, setDataSource] = useState([]);
    const [rightList, setrightList] = useState([]);
    const [currentRights, setCurrentRights] = useState([]);
    const [currentId, setcurrentId] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={() => confirmMethod(item)}/>
                    <Button type="primary" shape="circle" icon={<UnorderedListOutlined/>}
                            onClick={() => {
                                setIsModalOpen(!isModalOpen)
                                setCurrentRights(item.rights)
                                setcurrentId(item.id)
                            }}/>
                </div>
            }
        },
    ]

    useEffect(() => {
        axios.get("/roles").then(res => {
            console.log(res.data)
            setDataSource(res.data)
        })
    }, [])
    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            console.log(res.data)
            setrightList(res.data)
        })
    }, [])

    const confirmMethod = (item) => {
        confirm({
            icon: <ExclamationCircleOutlined/>,
            content: "确认是否删除？",
            onOk() {
                deleteMethod(item)
            },
            onCancel() {
            },
        });
    }

    const deleteMethod = (item) => {
        console.log(item)
        axios.delete(`/roles/${item.id}`).then(
            setDataSource(dataSource.filter(i => i.id !== item.id))
        )
    }


    const handleOk = () => {
        console.log(currentId)
        setIsModalOpen(false);

        axios.patch(`/roles/${currentId}`, {
            rights: currentRights
        }).then(
            setDataSource(dataSource.map(item => {
                if (item.id === currentId) {
                    return {
                        ...item,
                        rights: currentRights
                    }
                }
                return item
            }))
        )
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const onCheck = (checkedKeys) => {
        setCurrentRights(checkedKeys.checked)
    };

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}></Table>
            <Modal title="权限列表" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkable
                    checkStrictly={true}
                    checkedKeys={currentRights}
                    onCheck={onCheck}
                    treeData={rightList}
                />
            </Modal>
        </div>
    );
}

export default RoleList;