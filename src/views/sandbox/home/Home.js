import React, {useEffect, useRef, useState} from 'react';
import {Avatar, Card, Col, Drawer, List, Row} from "antd";
import {NavLink} from "react-router-dom";
import Meta from "antd/es/card/Meta";
import {EditOutlined, EllipsisOutlined, SettingOutlined} from "@ant-design/icons";
import axios from "axios";
import * as Echarts from "echarts";
import _ from 'lodash'

function Home(props) {

    const [viewData, setViewData] = useState([])
    const [starData, setStarData] = useState([])
    const [open, setOpen] = useState(false)
    const [pieChart, setpieChart] = useState(null)
    const [allList, setallList] = useState([])

    const barRef = useRef()
    const pieRef = useRef()

    const {username, region, role: {roleName}} = JSON.parse(localStorage.getItem("token"))


    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&limit=6`).then(res => {
            setViewData(res.data)
        })
    }, [])

    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category&_sort=star&_order=desc&limit=6`).then(res => {
            setStarData(res.data)
        })
    }, [])

    useEffect(() => {

        axios.get("/news?publishState=2&_expand=category").then(res => {
            // console.log(res.data)
            // console.log()
            renderBarView(_.groupBy(res.data, item => item.category.title))
            setallList(res.data)
        })
        return () => {
            window.onresize = null
        }
    }, [])

    const renderBarView = (obj) => {
        var myChart = Echarts.init(barRef.current);

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '新闻分类图示'
            },
            tooltip: {},
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: Object.keys(obj),
                axisLabel: {
                    rotate: "45",
                    interval: 0
                }
            },
            yAxis: {
                minInterval: 1
            },
            series: [{
                name: '数量',
                type: 'bar',
                data: Object.values(obj).map(item => item.length)
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

        window.onresize = () => {
            // console.log("resize")
            myChart.resize()
        }
    }

    const renderPieView = (obj) => {
        //数据处理工作

        var currentList = allList.filter(item => item.author === username)
        var groupObj = _.groupBy(currentList, item => item.category.title)
        var list = []
        for (var i in groupObj) {
            list.push({
                name: i,
                value: groupObj[i].length
            })
        }
        var myChart;
        if (!pieChart) {
            myChart = Echarts.init(pieRef.current);
            setpieChart(myChart)
        } else {
            myChart = pieChart
        }
        var option;

        option = {
            title: {
                text: '当前用户新闻分类图示',
                // subtext: '纯属虚构',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [
                {
                    name: '发布数量',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        option && myChart.setOption(option);

    }

    return (
        <div>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户最常浏览" bordered={true}>
                        <List
                            dataSource={viewData}
                            renderItem={(item) => (
                                <List.Item>
                                    <NavLink to={`/news-manage/preview/${item.id}`}>{item.title}</NavLink>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" bordered={false}>
                        <List
                            dataSource={starData}
                            renderItem={(item) => (
                                <List.Item>
                                    <NavLink to={`/news-manage/preview/${item.id}`}>{item.title}</NavLink>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" onClick={async () => {

                                await setOpen(true)
                                // init初始化
                                renderPieView()
                            }}/>,
                            <EditOutlined key="edit"/>,
                            <EllipsisOutlined key="ellipsis"/>,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel"/>}
                            title="Card title"
                            description="This is the description"
                        />
                    </Card>
                </Col>
            </Row>

            <Drawer width="500px" title="个人新闻分类" placement="right" closable={true} onClose={() => {
                setOpen(false)
            }} open={open}>
                <div ref={pieRef} style={{
                    width: '100%',
                    height: "400px",
                    marginTop: "30px"
                }}></div>
            </Drawer>

            <div ref={barRef} style={{
                width: '100%',
                height: "400px",
                marginTop: "30px"
            }}></div>
        </div>
    );
}

export default Home;