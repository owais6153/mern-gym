import React, {useState, useEffect} from "react";
import { Link } from 'react-router-dom';
import { useParams, useLocation } from 'react-router-dom';
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
    Spinner,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { homeCategoriesViewAction, homeCategoriesUpdateAction } from "../../redux/actions/homeCategoriesAction";
import { connect } from "react-redux"
import TextAreaEditor from "../../components/TextAreaEditor/TextAreaEditor";

function HomeCategoriesEdit (props) {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate()
    const [error, setError] = useState({});
    const [HomeCategories, HomeCategoriesData] = useState({
      id:(location.state?location.state.id:0),
      title:(location.state?location.state.title:""),
      description:(location.state?location.state.description:""),
      type:(location.state?location.state.type:""),
      status:"1",
      display_order:(location.state?location.state.display_order:1),
      image_url:(location.state?location.state.image_url:null),
    });

    useEffect(()=>{
      if(props.errors) setError(props.errors);
    } , [props.errors])
    useEffect(()=>{
      props.homeCategoriesViewAction(id).then(response => {});
    } , [])
    useEffect(()=>{
      if(props.home_categorie) {
        HomeCategoriesData((currentState) => ({
          ...currentState,
          ...props.home_categorie,
          status: (props.home_categorie.status == true?"1":"0"),
        }));
      }
    } , [props.home_categorie])
    
    const handleChange = (e) => {
      HomeCategoriesData((currentState) => ({
        ...currentState,
        [e.target.name]: e.target.value
      }));
      setError({})
    }
    const CreateHomeCategoriesFormSubmitHandle = (e) => {
      e.preventDefault();
      let formData = new FormData();
      formData.append('id', HomeCategories.id);
      formData.append('title', HomeCategories.title);
      formData.append('description', HomeCategories.description);
      formData.append('type', HomeCategories.type);
      formData.append('status', HomeCategories.status);
      formData.append('display_order', HomeCategories.display_order);
      formData.append('image_url', HomeCategories.image_url);
      props.homeCategoriesUpdateAction(formData, HomeCategories.id, navigate).then(response => {});
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
                                              <h5 className="card-title font-weight-bold">Edit Categories</h5>
                                              <ul className="breadCrumbList">
                                                  <li><a path="/admin/dashboard" >Home</a></li>
                                                  <li><a path="/admin/Users" >App Content</a></li>
                                                  <li><a path="/admin/Users" >Edit Categories</a></li>
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
                        <form onSubmit={CreateHomeCategoriesFormSubmitHandle}>
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
                                    <Input type="select" name="type" id="type" onChange={handleChange} 
                                      invalid={error.type ? true:false}
                                      value={HomeCategories.type} 
                                    >
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
                                                  <img alt="not fount" width={"250px"} src={
                                                    HomeCategories.image_url.constructor.name === 'File' ? URL.createObjectURL(HomeCategories.image_url) :HomeCategories.image_url} />
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

                                <TextAreaEditor value={HomeCategories.description} error={error} />

                                <div className="col-lg-12">
                                    <div className="d-flex justify-content-end align-items-center w-100">
                                        <Button type="reset" color="default">
                                            discard
                                            <i className="fa fa-trash warning"/>{" "}
                                        </Button>

                                        <Button type="submit" color="primary">
                                            Save & Publish
                                            <i className="white">
                                                <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8.98584 14.4586C9.39209 14.4586 9.73584 14.1461 9.73584 13.7086V7.45863H12.9546C13.6421 7.45863 13.9546 6.67738 13.4858 6.17738L8.01709 0.677383C7.70459 0.396133 7.23584 0.396133 6.95459 0.677383L1.45459 6.17738C0.98584 6.67738 1.29834 7.45863 1.98584 7.45863H5.23584V13.7086C5.23584 14.1461 5.54834 14.4586 5.98584 14.4586H8.98584Z" fill="white"/>
                                                </svg>
                                            </i>
                                        </Button>
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
  home_categorie: state.homeCategoriesReducer.home_categorie,
})

const mapDispatchToProps = (dispatch) => ({
  homeCategoriesViewAction: (id) => dispatch( homeCategoriesViewAction(id) ),
  homeCategoriesUpdateAction: (data, id, navigate) => dispatch( homeCategoriesUpdateAction(data, id, navigate) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeCategoriesEdit)