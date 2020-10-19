import React, { useEffect, useRef, useState } from 'react';
import EmailEditor from 'react-email-editor';
import {upload_static} from '../../api/upload-static';
import {noti} from '../../services/noti-service';
import $ from 'jquery';
import {v4 as uuid} from 'uuid';
import { enabled } from 'store';

const Editor = (props) => {
    const emailEditorRef = useRef(null);
    // const [design, setDesign] = useState(props.design);
    const onLoad = () => {
        console.log(props.design);
        // if (!emailEditorRef.current) return;

        if (!$.isEmptyObject(props.design)) {
            emailEditorRef.current.editor.loadDesign(props.design);
        }

        emailEditorRef.current.editor.addEventListener('design:updated', (data) => {
            emailEditorRef.current.editor.exportHtml(function (data) {
                props.on_change_general(data.design);
            })
        });

        emailEditorRef.current.editor.registerProvider('userUploads', function (params, done) {
            const page = params.page || 1;
            const perPage = params.perPage || 20;
            const total = 100;
            const hasMore = total > page * perPage;
          
            // Load images from your database here...
            const images = [];
          
            done(images, { hasMore, page, perPage, total });
          });

        emailEditorRef.current.editor.registerCallback('image', async function (file, done) {
            try {
                const file_url = await upload_static(file.accepted[0]);
                done({progress: 100, url: file_url});
            } catch (error) {
                console.error('Unlayer upload file: ', error.message);
                noti('error', 'Unlayer cannot upload file');
            }
        })
    };

    return (
        <div>
            <EmailEditor
                ref={emailEditorRef}
                onLoad={onLoad}
            />
        </div>
    );
};

export default Editor;