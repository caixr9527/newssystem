import React, {useEffect, useState} from 'react';
import {Button, Modal, Popover, Switch, Table, Tag} from "antd";
import axios from "axios";
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from '@ant-design/icons';

const {confirm} = Modal


function RightList(props) {

    const [dataSource, setDataSource] = useState([]);
    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            console.log(res.data)
            res.data.filter(r => r.children.length === 0).map(r => r.children = null)
            setDataSource(res.data)
        })
    }, [])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '权限名称',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            key: 'key',
            render: (key) => {
                return <Tag color={"red"}>{key}</Tag>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={() => confirmMethod(item)}/>
                    <Popover content={<Switch checkedChildren="开启" unCheckedChildren="关闭"
                                              checked={item.pagepermisson === 1}
                                              onClick={() => switchMethod(item)}/>}
                             title="权限开关"
                             trigger={item.pagepermisson === undefined ? "" : "click"}>
                        <Button type="primary" shape="circle" icon={<EditOutlined/>}
                                disabled={item.pagepermisson === undefined}/>
                    </Popover>
                </div>
            }
        },
    ];

    const switchMethod = (item) => {
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1

        if (item.grade === 1) {
             axios.patch(`/rights/${item.id}`,{
                 pagepermisson: item.pagepermisson
             }).then(
                 setDataSource([...dataSource])
             )
        }else {
            axios.patch(`/children/${item.id}`,{
                pagepermisson: item.pagepermisson
            }).then(
                setDataSource([...dataSource])
            )
        }
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

    const deleteMethod = (item) => {
        console.log(item)
        if (item.grade === 1) {
            axios.delete(`/rights/${item.id}`).then(
                setDataSource(dataSource.filter(i => i.id !== item.id))
            )
        } else {
            let list = dataSource.filter(data => data.id === item.rightId)
            list[0].children = list[0].children.filter(data => data.id !== item.id)
            axios.delete(`/children/${item.id}`).then(
                setDataSource([...dataSource])
            )
        }
    }

    return (
        <div>

            <Table
                columns={columns}
                dataSource={dataSource}
                sticky={false}
                pagination={{
                    pageSize: 5
                }}
            />

        </div>
    );
}

export default RightList;