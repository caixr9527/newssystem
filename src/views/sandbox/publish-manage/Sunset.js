import React from 'react';
import usePublish from "../../../component/publish-manage/usePublish";
import NewsPublish from "../../../component/publish-manage/NewsPublish";
import {Button} from "antd";

function Sunset(props) {
    const {dataSource, del} = usePublish(3)

    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id) => <Button danger onClick={() => del(id)}>
                删除
            </Button>}></NewsPublish>
        </div>
    );
}

export default Sunset;