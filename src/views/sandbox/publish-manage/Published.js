import React from 'react';
import NewsPublish from "../../../component/publish-manage/NewsPublish";
import usePublish from "../../../component/publish-manage/usePublish";
import {Button} from "antd";

function Published(props) {
    const {dataSource, sunset} = usePublish(2)

    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id) => <Button type={"primary"} onClick={() => sunset(id)}>
                下线
            </Button>}></NewsPublish>
        </div>
    );
}

export default Published;