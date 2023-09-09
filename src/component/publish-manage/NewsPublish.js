import React from 'react'
import {Button, Table} from 'antd'
import {NavLink} from "react-router-dom";

export default function NewsPublish(props) {

    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, item) => {
                return <NavLink to={`/news-manage/preview/${item.id}`}>{title}</NavLink>
            }
        },
        {
            title: '作者',
            dataIndex: 'author'
        },
        {
            title: "新闻分类",
            dataIndex: 'category',
            render: (category) => {
                return <div>{category.title}</div>
            }
        },
        {
            title: "操作",
            render: (item) => {
                return <div>
                    {/*可以用插槽*/}
                    {props.button(item.id)}
                </div>
            }
        }
    ];

    return (
        <div>
            <Table dataSource={props.dataSource} columns={columns}
                   pagination={{
                       pageSize: 5
                   }}
                   rowKey={item => item.id}
            />
        </div>
    )
}
