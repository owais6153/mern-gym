
import React, {useEffect, useState} from "react";
import { 
  FormGroup,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";

function ImageUploder (props) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(()=>{
    setImageUrl(props.image_url)
  } , [props.image_url])

  return (
    <FormGroup className="col-lg-6">
        <Label for="title">Image Thumbnail</Label>
        <div className="tpfupload">
            <div className="fileBg">
                {imageUrl ? 
                    <div>
                      <img alt="not fount" width={"250px"} 
                        src={imageUrl.constructor.name === 'File' ? URL.createObjectURL(imageUrl) :imageUrl} 
                      />
                      <button type="button" className="btn btn-danger" onClick={(event) => {
                          setImageUrl(null);
                        }}
                      >Remove</button>
                    </div>
                  :
                  <span className="icon">
                      <svg width="94" height="94" viewBox="0 0 94 94" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect opacity="0.05" width="94" height="94" rx="47" fill="white"/>
                          <path d="M49.9951 53.9759C50.8063 53.9759 51.4926 53.3519 51.4926 52.4784V39.9989H57.9195C59.2923 39.9989 59.9163 38.439 58.9803 37.4406L48.0608 26.4587C47.4368 25.8971 46.5008 25.8971 45.9393 26.4587L34.9574 37.4406C34.0214 38.439 34.6454 39.9989 36.0181 39.9989H42.5074V52.4784C42.5074 53.3519 43.1314 53.9759 44.005 53.9759H49.9951Z" fill="#61A1F8"/>
                          <rect x="24.3706" y="57.3037" width="45.2588" height="7.32127" rx="2" fill="#61A1F8"/>
                      </svg>
                  </span>
                }
                
                <Input type="file" name={props.field_name?props.field_name:"image"} id={props.field_name?props.field_name:'image'} invalid={props.error.image_url ? true:false}
                  onChange={(event) => {
                    setImageUrl(event.target.files[0]);
                  }}
                />
            </div>
            {
            !imageUrl && 
              <>
                <div className="titleUpload">
                  <h4>Upload an Image</h4>
                  <p>
                    1920 x 1080 (16:9 Aspect Ratio)<br />
                    Maximum Size: 5 mb
                  </p>
                </div>
              </>
            }
        </div>
        { props.error && <FormFeedback>{props.error.image_url}</FormFeedback> }
    </FormGroup>
  )
}
export default ImageUploder