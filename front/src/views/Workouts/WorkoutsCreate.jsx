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
import { WorkoutsCreateAction } from "../../redux/actions/workoutsAction";
import { getHomeCategoriesListAction } from "../../redux/actions/homeCategoriesAction";
import { connect } from "react-redux"
import ImageUploder from "../../components/Uploders/ImageUploder";
import VideoUploder from "../../components/Uploders/VideoUploder";
import MultiSelectDropdown from "../../components/MultiSelect/MutliSelect";
import TextAreaEditor from "../../components/TextAreaEditor/TextAreaEditor";
import SaveAndPublish from "../../components/Buttons/SaveAndPublish";
import Discart from "../../components/Buttons/Discart";

function WorkoutsCreate (props) {
    const navigate = useNavigate()
    const [error, setError] = useState({});
    // const [HomeCategoriesLocal, setHomeCategoriesLocal] = useState([]);

    useEffect(()=>{
      if(props.errors) setError(props.errors);
    } , [props.errors])
    useEffect(()=>{
      props.getHomeCategoriesListAction().then(response => {});
    } , [])
    const [HomeCategoriesLocal, setHomeCategoriesLocal] = useState([]);
    const [DropDownOptions, setDropDownOptions] = useState(null);

    useEffect(() => {
        if(props.home_categories) {
            let data = [];
            props.home_categories.map(v => {
                data.push({label: v.title,value:v.id })
            });
            setDropDownOptions(data);
        }
    }, [props.home_categories])
    useEffect(()=>{
      if(props.home_categories) setHomeCategoriesLocal(props.home_categories.filter(value => {return value.type === "workout"}));
    } , [props.home_categories])
    const handleChange = (e) => {
      setError({})
    }
    const CreateWorkoutsFormSubmitHandle = (e) => {
      e.preventDefault();
      let formData = new FormData(e.target);
      props.WorkoutsCreateAction(formData, navigate).then(response => {});
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
                                          <Link to="/admin/workouts">
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
                                              <h5 className="card-title font-weight-bold">New Workout</h5>
                                              <ul className="breadCrumbList">
                                                  <li><a path="/admin/dashboard" >Home</a></li>
                                                  <li><a path="/admin/workouts" >Workout</a></li>
                                                  <li><a path="/admin/workouts" >New</a></li>
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
                        <form onSubmit={CreateWorkoutsFormSubmitHandle} enctype="multipart/form-data">
                            <div className="form-row">
                                <FormGroup className="col-lg-6">
                                    <Label for="title">Title</Label>
                                    <Input type="text" name="title" id="title" placeholder="Enter title"
                                          invalid={error.title ? true:false} required onChange={handleChange} 
                                        />
                                    { error && <FormFeedback>{error.title}</FormFeedback> }
                                </FormGroup>

                                <div className="col-lg-6">
                                    <h4 className="mt-3 mb-0">Status</h4>
                                    <FormGroup check inline className="form-check-radio">
                                        <Label className="form-check-label">
                                            <Input type="radio" name="status" onChange={handleChange} value={1} invalid={error.status ? true:false} defaultChecked/>
                                            ON
                                            <span className="form-check-sign"></span>
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check inline className="form-check-radio">
                                        <Label className="form-check-label">
                                            <Input type="radio" name="status" onChange={handleChange} value={0} invalid={error.status ? true:false}/>
                                            OFF
                                            <span className="form-check-sign"></span>
                                        </Label>
                                    </FormGroup>
                                    { error && <FormFeedback>{error.status}</FormFeedback> }
                                </div>
                                <ImageUploder field_name={"image"} error={error} />
                                <VideoUploder field_name={"video"} error={error} />
                                <FormGroup className="col-lg-6">
                                    <Label for="category">Category</Label>
                                    <Input type="select" name="category" id="category" onChange={handleChange} invalid={error.category ? true:false} multiple='multiple' > 
                                        <option disabled>Select</option>
                                        {HomeCategoriesLocal && HomeCategoriesLocal.map((home_categorie) => (
                                          <option key={home_categorie.id} value={home_categorie.id}>{home_categorie.title}</option>
                                        ))}
                                    </Input>
                                    { error && <FormFeedback>{error.category}</FormFeedback> }
                                </FormGroup>

                                <TextAreaEditor error={error} />

                                <div className="col-lg-12">
                                    <div className="d-flex justify-content-end align-items-center w-100">
                                        <Discart status_field={true} back="workouts" />
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
  home_categories: state.homeCategoriesReducer.home_categories,
})

const mapDispatchToProps = (dispatch) => ({
  WorkoutsCreateAction: (data, navigate) => dispatch( WorkoutsCreateAction(data, navigate) ),
  getHomeCategoriesListAction: (data) => dispatch( getHomeCategoriesListAction(data) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutsCreate)