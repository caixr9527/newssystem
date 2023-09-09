import React from 'react';
import NewsPublish from "../../../component/publish-manage/NewsPublish";
import usePublish from "../../../component/publish-manage/usePublish";
import {Button} from "antd";

function Unpublished(props) {

    const {dataSource, publish} = usePublish(1)

    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id) => <Button type={"primary"} onClick={() => publish(id)}>
                发布
            </Button>}></NewsPublish>
        </div>
    );
}

export default Unpublished;