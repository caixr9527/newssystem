import React, {useEffect, useState} from 'react';
import {PageHeader} from '@ant-design/pro-layout'
import {Button, Form, Input, message, notification, Select, Steps} from "antd";
import style from './News.module.css'
import axios from "axios";
import NewsEditor from "../../../component/news-manage/NewsEditor";
import {useNavigate} from "react-router-dom";

function NewsAdd(props) {

    const [current, setCurrent] = useState(0)
    const [categoryList, setCategoryList] = useState([])
    const [formInfo, setFormInfo] = useState({})
    const [content, setContent] = useState("")
    const User = JSON.parse(localStorage.getItem("token"))
    const navigate = useNavigate()


    useEffect(() => {
        axios.get("/categories").then(res => {
            console.log(res.data)
            const list = res.data.map(item => {
                    return {
                        id: item.id,
                        label: item.title,
                        value: item.id
                    }
                }
            )
            console.log(list)
            setCategoryList(list)
        })
    }, [])

    const next = () => {
        if (current === 0) {
            form.validateFields().then(res => {
                setFormInfo(res)
                setCurrent(current + 1)
            }).catch(err => {
                console.log(err)
            })
        } else {
            if (content === "" || content.trim() === "<p></p>") {
                message.error("新闻内容为空")
            } else {
                console.log(formInfo, content)
                setCurrent(current + 1)
            }

        }
    }

    const pre = () => {
        setCurrent(current - 1)
    }

    const [form] = Form.useForm();
    const handleSave = (auditState) => {
        axios.post('/news', {
            ...formInfo,
            "content": content,
            "region": User.region ? User.region : "全球",
            "author": User.username,
            "roleId": User.roleId,
            "auditState": auditState,
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
            "publishTime": 0
        }).then(res => {
            notification.info({
                message: `通知`,
                description: `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看`,
                placement: "bottomRight"
            })
            navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
        })
    }

    return (
        <div>
            <PageHeader className="site-page-header" title="撰写新闻"/>

            <Steps
                current={current}
                items={[
                    {
                        title: '基本信息',
                        description: '新闻标题，新闻分类',
                    },
                    {
                        title: '新闻内容',
                        description: '新闻主体内容',

                    },
                    {
                        title: '新闻提交',
                        description: '保存草稿或者提交审核',
                    },
                ]}
            />

            <div style={{marginTop: "50px"}}>
                <div className={current === 0 ? '' : style.active}>
                    <Form
                        name="basic"
                        labelCol={{span: 4}}
                        wrapperCol={{span: 20}}
                        style={{maxWidth: 600}}
                        initialValues={{remember: true}}
                        autoComplete="off"
                        form={form}
                    >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[{required: true, message: '请输入新闻标题！'}]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[{required: true, message: '请输入新闻分类！'}]}
                        >
                            <Select
                                showSearch
                                allowClear
                                style={{width: 240}}
                                onChange={(item) => {
                                    console.log(item)
                                }}
                                options={categoryList}
                            />
                        </Form.Item>

                    </Form>
                </div>
                <div className={current === 1 ? '' : style.active}>
                    <NewsEditor getContent={(values) => {
                        setContent(values)
                    }}></NewsEditor>
                </div>
                <div className={current === 2 ? '' : style.active}></div>
            </div>
            <div style={{marginTop: "50px"}}>
                {
                    current > 0 && <Button type="primary" onClick={() => pre()}>上一步</Button>
                }
                {
                    current < 2 && <Button type="primary" onClick={() => next()}>下一步</Button>
                }
                {
                    current === 2 && <span style={{marginRight: "10px"}}>
                        <Button type="primary" onClick={() => handleSave(0)}>保存草稿箱</Button>
                        <Button danger onClick={() => handleSave(1)}>提交审核</Button>
                    </span>
                }

            </div>
        </div>
    );
}

export default NewsAdd;