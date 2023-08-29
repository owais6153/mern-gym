import React, {useState, useEffect} from "react";
import { EditorState, ContentState, convertFromHTML, convertToRaw} from 'draft-js';
import draftToHtml from 'draftjs-to-html';

import { Editor } from 'react-draft-wysiwyg';
import { 
  FormGroup,
  Label,
  FormFeedback,
} from "reactstrap";

function TextAreaEditor (props) {
    const [textBox, settextBox] = useState();
    const [editorState, setEditorState] = useState(() =>
      EditorState.createWithContent(
        ContentState.createFromBlockArray(
          convertFromHTML(props.value?props.value:'<p></p>')
        )
      )
    );

    useEffect(()=>{
      if(props.value) {
        setEditorState(
          EditorState.createWithContent(
            ContentState.createFromBlockArray(
              convertFromHTML(props.value?props.value:'<p></p>')
            )
          )
        )
      }
    } , [props.value])

    const updateTextDescription = async (state) => {
      await setEditorState(state);
      const data = convertToRaw(editorState.getCurrentContent());
      // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
      settextBox(draftToHtml(convertToRaw(editorState.getCurrentContent())));
      // settextBox(editorState.getCurrentContent().getPlainText());
    };

    return (
      <FormGroup className="col-lg-12">
          <input type="hidden" name="description" id="description" value={textBox} />
          <Label for="description">Description</Label>
          <Editor 
            editorState={editorState}
            onEditorStateChange={updateTextDescription}
            editorClassName="editorClassName"
          />
          { props.error && <FormFeedback>{props.error.description}</FormFeedback> }
      </FormGroup>
    )
}
export default TextAreaEditor