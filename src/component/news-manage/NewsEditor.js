import React, {useEffect, useState} from 'react';
import {Editor} from 'react-draft-wysiwyg'
import {convertToRaw} from 'draft-js'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import draftToHtml from 'draftjs-to-html'
import htmlToDraftjs from 'html-to-draftjs'
import ContentState from "draft-js/lib/ContentState";
import EditorState from "draft-js/lib/EditorState";

function NewsEditor(props) {

    useEffect(()=>{
        const html = props.content
        if (html === undefined) return
        const content = htmlToDraftjs(html)
        if (content) {
            const contentState = ContentState.createFromBlockArray(content.contentBlocks)
            const editorState = EditorState.createWithContent(contentState)
            setEditorState(editorState)
        }

    },[props.content])

    const [editorState, setEditorState] = useState("")
    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(editorState) => setEditorState(editorState)}
                onBlur={() => {
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }}
            />
        </div>
    );
}

export default NewsEditor;