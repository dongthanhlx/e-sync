import React, { createRef } from 'react';
import EmailEditor from 'react-email-editor';
import {upload_static} from '../../api/upload-static';
import {noti} from '../../services/noti-service';

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.timer = null;
        this.emailEditorRef = createRef();
        this.onLoad = this.onLoad.bind(this);
    }

    componentDidUpdate(prev_props) {
        if (prev_props.design !== this.props.design) this.onLoad();
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    load() {
        const unlayer = this.emailEditorRef.current.editor;
        const {type, design, on_change_general, on_change_html_general} = this.props;

        if (type === 'legacy') {
            unlayer.loadDesign({
                html: design ? design: '<html><body></body></html>',
                classic: true,
            });
        } else {
            design && unlayer.loadDesign(design)
        }

        unlayer.addEventListener('design:updated', (data) => {
            unlayer.exportHtml(function (data) {
                if (type === 'legacy') {
                    on_change_general(data.html);
                } else {
                    on_change_general(data.design);
                }

                on_change_html_general(data.html);
            })
        });

        unlayer.registerCallback('image', async function (file, done) {
            try {
                const file_url = await upload_static(file.accepted[0]);
                done({progress: 100, url: file_url});
            } catch (error) {
                console.error('Unlayer upload file: ', error.message);
                noti('error', 'Unlayer cannot upload file');
            }
        })
    }

    onLoad () {
            this.timer = setTimeout(() => {
                this.load()
            }, 0);
    }

    render () {
        return (
            <div >
                <EmailEditor
                    ref={this.emailEditorRef}
                    onLoad={this.onLoad}
                    projectId='1071'
                />
            </div>
        )
    }
}

export default Editor;
