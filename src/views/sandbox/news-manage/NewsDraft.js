import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Button, Modal, notification, Table} from "antd";
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined, CloudUploadOutlined} from "@ant-design/icons";
import {NavLink, useNavigate} from "react-router-dom";

const {confirm} = Modal

function NewsDraft(props) {

    const [dataSource, setDataSource] = useState([]);

    const {username} = JSON.parse(localStorage.getItem("token"))

    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
            console.log(res.data)
            setDataSource(res.data)
        })
    }, [username])

    const handleCheck = (id) => {
        axios.patch(`/news/${id}`, {
            auditState: 1
        }).then(res => {
            navigate('/audit-manage/list')
            notification.info({
                message: `通知`,
                description: `您可以到审核列表中查看`,
                placement: "bottomRight"
            })
        })
    }

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
            title: '新闻标题',
            dataIndex: 'title',
            key: 'title',
            render: (title, item) => {
                return <NavLink to={`/news-manage/preview/${item.id}`}>{title}</NavLink>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
            key: 'author'
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            key: 'category',
            render: (category) => {
                return category.title
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={() => confirmMethod(item)}/>
                    <Button type="primary" shape="circle" icon={<EditOutlined/>}
                            onClick={() => navigate(`/news-manage/update/${item.id}`)}/>
                    <Button type="primary" shape="circle" icon={<CloudUploadOutlined/>}
                            onClick={() => handleCheck(item.id)}/>
                </div>
            }
        },
    ];


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
        axios.delete(`/news/${item.id}`).then(res => {
            setDataSource(dataSource.filter(data => data.id !== item.id))
        })
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
                rowKey={item => item.id}
            />

        </div>
    );
}

export default NewsDraft;