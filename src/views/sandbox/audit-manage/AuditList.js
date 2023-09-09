import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Button, notification, Table, Tag} from "antd";
import {NavLink, useNavigate} from "react-router-dom";

function AuditList(props) {

    const {username} = JSON.parse(localStorage.getItem("token"))

    const [dataSource, setDataSource] = useState([]);

    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`)
            .then(res => {
                console.log(res.data)
                setDataSource(res.data)
            })
    }, [username])
    const colorList = ["black", "orange", "green", "red"]
    const auditList = ["未审核", '审核中', '已通过', '未通过']

    const columns = [
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
            key: 'author',
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            key: 'category',
            render: (category) => {
                return <div>{category.title}</div>
            }
        },
        {
            title: '审核状态',
            dataIndex: 'auditState',
            key: 'auditState',
            render: (auditState) => {
                return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    {
                        item.auditState === 1 &&
                        <Button type={"primary"} onClick={() => handlerRevert(item)}>撤销</Button>
                    }
                    {
                        item.auditState === 2 &&
                        <Button type={"primary"} onClick={() => handlerPublish(item)}>发布</Button>
                    }
                    {
                        item.auditState === 3 &&
                        <Button type={"primary"} onClick={() => handlerUpdate(item)}>更新</Button>
                    }

                </div>
            }
        },
    ];

    const handlerRevert = (item) => {
        console.log(item)
        axios.patch(`/news/${item.id}`, {
            auditState: 0
        }).then(res => {
            setDataSource(dataSource.filter(data => data.id !== item.id))
            notification.info({
                message: `通知`,
                description: "您可以到草稿箱中查看！",
                placement: "bottomRight"
            })
        })

    }
    const handlerUpdate = (item) => {
        navigate(`/news-manage/update/${item.id}`)
    }

    const handlerPublish = (item) => {
        console.log(item)
        axios.patch(`/news/${item.id}`, {
            publishState: 2,
            publishTime: Date.now()
        }).then(res => {
            navigate(`/publish-manage/published`)
            notification.info({
                message: `通知`,
                description: "您可以到发布管理-已发布中查看！",
                placement: "bottomRight"
            })
        })
    }


    return (
        <div>
            <Table
                columns={columns}
                dataSource={dataSource}
                sticky={false}
                rowKey={item => item.id}
                pagination={{
                    pageSize: 5
                }}
            />
        </div>
    );
}

export default AuditList;