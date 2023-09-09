import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Button, Table} from "antd";
import {NavLink} from "react-router-dom";


function Audit(props) {
    const [dataSource, setDataSource] = useState([])
    const {roleId, region, username} = JSON.parse(localStorage.getItem("token"))
    const roleObj = {
        "1": "superadmin",
        "2": "admin",
        "3": "editor"
    }
    useEffect(() => {
        axios.get(`/news?auditState=1&_expand=category`).then(res => {
            console.log(res.data)
            const list = res.data
            setDataSource(roleObj[roleId] === "superadmin" ? list : [
                ...list.filter(item => item.author === username),
                ...list.filter(item => item.region === region && roleObj[item.roleId] === "editor")
            ])
        })
    }, [])

    const handlerAudit = (item, auditState, publishState) => {
        axios.patch(`/news/${item.id}`, {
            auditState,
            publishState
        }).then(res => {
            setDataSource(dataSource.filter(data => data.id !== item.id))

        })
    }

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
            title: '操作',
            render: (item) => {
                return <div>
                    <Button type={"primary"} onClick={() => handlerAudit(item, 2, 1)}>通过</Button>
                    <Button danger onClick={() => handlerAudit(item, 3, 0)}>驳回</Button>
                </div>
            }
        },
    ];

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

export default Audit;