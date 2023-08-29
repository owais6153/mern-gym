import React, {useState, useEffect} from "react";
import { Link } from 'react-router-dom';
import { 
    Card, 
    CardBody, 
    Row, 
    Col,
    Button,
    FormGroup,
    Label,
    Input,
    FormFeedback,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { homeCategoriesCreateAction } from "../../redux/actions/homeCategoriesAction";
import { connect } from "react-redux"
import TextAreaEditor from "../../components/TextAreaEditor/TextAreaEditor";
import SaveAndPublish from "../../components/Buttons/SaveAndPublish";
import Discart from "../../components/Buttons/Discart";

function HomeCategoriesCreate (props) {
    const navigate = useNavigate()

    const [error, setError] = useState({});
    const [HomeCategories, HomeCategoriesData] = useState({
      title:"",
      description:"",
      type:"",
      status:1,
      display_order:1,
      image_url:null,
    });

    useEffect(()=>{
      if(props.errors) setError(props.errors);
    } , [props.errors])

    const handleChange = (e) => {
      HomeCategoriesData((currentState) => ({
        ...currentState,
        [e.target.name]: e.target.value
      }));
      setError({})
    }
    const CreateHomeCategoriesFormSubmitHandle = (e) => {
      e.preventDefault();
      let formData = new FormData(e.target);
      // formData.append('title', HomeCategories.title);
      // formData.append('description', HomeCategories.description);
      // formData.append('type', HomeCategories.type);
      formData.append('status', HomeCategories.status);
      // formData.append('display_order', HomeCategories.display_order);
      // formData.append('image_url', HomeCategories.image_url);
      props.homeCategoriesCreateAction(formData, navigate).then(response => {});
    }
    return (
        <>
            <div className="content">
                <Card className="breadCrumb">
                    <CardBody>
                      <div className="tpf-horizontal-card">
                          <Row>
                              <Col xl="4">
                                  <div className="d-flex">
                                      <div>
                                          <Link to="/admin/app-content">
                                          <figure className="figImage d-flex align-items-center">
                                              <svg width="50" height="50" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                  <circle opacity="0.2" cx="18" cy="18" r="18" fill="#4F76D9"/>
                                                  <path d="M13.6475 16.758C13.3486 17.0568 13.3486 17.5549 13.6475 17.8537L20.0889 24.3283C20.4209 24.6271 20.9189 24.6271 21.2178 24.3283L21.9814 23.5646C22.2803 23.2658 22.2803 22.7678 21.9814 22.4357L16.8682 17.2892L21.9814 12.176C22.2803 11.8439 22.2803 11.3459 21.9814 11.0471L21.2178 10.2834C20.9189 9.98456 20.4209 9.98456 20.0889 10.2834L13.6475 16.758Z" fill="white"/>
                                              </svg>
                                          </figure>
                                          </Link>
                                      </div>

                                      <div className="pl-3 flex-shrink-1 w-100 d-flex align-items-center">
                                          <div className="title">
                                              <h5 className="card-title font-weight-bold">New Categories</h5>
                                              <ul className="breadCrumbList">
                                                  <li><a path="/admin/dashboard" >Home</a></li>
                                                  <li><a path="/admin/Users" >App Content</a></li>
                                                  <li><a path="/admin/Users" >New Categories</a></li>
                                              </ul>
                                          </div>
                                      </div>
                                  </div>
                              </Col>

                              
                          </Row>
                      </div>
                    </CardBody>
                </Card>

                <Card className="guide-card">
                    <CardBody>
                        <form onSubmit={CreateHomeCategoriesFormSubmitHandle} enctype="multipart/form-data">
                            <div className="form-row">
                                <FormGroup className="col-lg-6">
                                    <Label for="title">Title</Label>
                                    <Input type="text" name="title" id="title" placeholder="Enter title"
                                          value={HomeCategories.title} onChange={handleChange} 
                                          invalid={error.title ? true:false}
                                        />
                                    { error && <FormFeedback>{error.title}</FormFeedback> }
                                </FormGroup>

                                <FormGroup className="col-lg-6">
                                    <Label for="category">Type</Label>
                                    <Input type="select" name="type" id="type" onChange={handleChange} invalid={error.type ? true:false} >
                                        <option disabled>Select</option>
                                        <option value="meal_plan">Meal plan</option>
                                        <option value="workout">Workout</option>
                                        <option value="home_page">Home page</option>
                                    </Input>
                                    { error && <FormFeedback>{error.type}</FormFeedback> }
                                </FormGroup>

                                <FormGroup className="col-lg-6">
                                    <Label for="display_order">Display order</Label>
                                    <Input type="number" name="display_order" id="display_order" placeholder="Enter display order"
                                          value={HomeCategories.display_order} onChange={handleChange} 
                                          invalid={error.display_order ? true:false}
                                        />
                                    { error && <FormFeedback>{error.display_order}</FormFeedback> }
                                </FormGroup>

                                <FormGroup className="col-lg-6">
                                    <Label for="title">Image Thumbnail</Label>
                                    <div className="tpfupload">
                                        <div className="fileBg">
                                            {HomeCategories.image_url ? 
                                                <div>
                                                  <img alt="not fount" width={"250px"} src={URL.createObjectURL(HomeCategories.image_url)} />
                                                  <button type="button" className="btn btn-danger" onClick={(event) => {
                                                      HomeCategoriesData((currentState) => ({
                                                        ...currentState,
                                                        image_url: null
                                                      }));
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
                                            
                                            <Input type="file" name="image_url" id="image_url"
                                              onChange={(event) => {
                                                HomeCategoriesData((currentState) => ({
                                                  ...currentState,
                                                  image_url: event.target.files[0]
                                                }));
                                              }}
                                              invalid={error.image_url ? true:false}
                                            />
                                        </div>
                                        {
                                        !HomeCategories.image_url && 
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
                                    { error && <FormFeedback>{error.image_url}</FormFeedback> }

                                </FormGroup>

                                <TextAreaEditor error={error} />

                                <div className="col-lg-12">
                                    <div className="d-flex justify-content-end align-items-center w-100">
                                        <Discart status_field={true} back="app-content" />
                                        <SaveAndPublish status_field={true} />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
  errors: state.commonReducer.errors,
})

const mapDispatchToProps = (dispatch) => ({
  homeCategoriesCreateAction: (data, navigate) => dispatch( homeCategoriesCreateAction(data, navigate) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeCategoriesCreate)