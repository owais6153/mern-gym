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
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { WorkoutsViewAction, WorkoutsUpdateAction } from "../../redux/actions/workoutsAction";
import { getHomeCategoriesListAction } from "../../redux/actions/homeCategoriesAction";
import { connect } from "react-redux"
import ImageUploder from "../../components/Uploders/ImageUploder";
import VideoUploder from "../../components/Uploders/VideoUploder";
import TextAreaEditor from "../../components/TextAreaEditor/TextAreaEditor";

function WorkoutsEdit (props) {
    const { id } = useParams();

    const location = useLocation();
    const navigate = useNavigate()
    const [error, setError] = useState({});
    const [WorkoutCategoriesLocal, setWorkoutCategoriesLocal] = useState([]);
    const [Workouts, WorkoutsData] = useState({
      id:(location.state?location.state.id:0),
      title:(location.state?location.state.title:""),
      // slug:(location.state?location.state.slug:""),
      // value:(location.state?location.state.value:""),
      // status:(location.state?(location.state.status == true?1:0):1),
    });
    const [HomeCategoriesLocal, setHomeCategoriesLocal] = useState([]);

    useEffect(()=>{
      if(props.errors) setError(props.errors);
    } , [props.errors])
    useEffect(()=>{
      props.getHomeCategoriesListAction().then(response => {});
    } , [])
    useEffect(()=>{
      props.WorkoutsViewAction(id).then(response => {});
    } , [])
    useEffect(()=>{
      if(props.workout) {
        WorkoutsData((currentState) => ({
          ...currentState,
          ...props.workout,
        }));
        if(props.workout.category){
          setWorkoutCategoriesLocal(props.workout.category.map(value => value.id))
        }
      }
    } , [props.workout])
    useEffect(()=>{
      if(props.home_categories) setHomeCategoriesLocal(props.home_categories.filter(value => {return value.type === "workout"}));
    } , [props.home_categories])

    const handleChange = (e) => {
      WorkoutsData((currentState) => ({
        ...currentState,
        [e.target.name]: e.target.value
      }));
      setError({})
    }
    const FreateWorkoutsFormSubmitHandle = (e) => {
      e.preventDefault();
      let formData = new FormData(e.target);
      props.WorkoutsUpdateAction(formData, id, navigate).then(response => {});
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
                                              <h5 className="card-title font-weight-bold">Edit Workout</h5>
                                              <ul className="breadCrumbList">
                                                  <li><a path="/admin/dashboard" >Home</a></li>
                                                  <li><a path="/admin/Users" >Workout</a></li>
                                                  <li><a path="/admin/Users" >Edit</a></li>
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
                        <form onSubmit={FreateWorkoutsFormSubmitHandle}>
                            <div className="form-row">
                                <FormGroup className="col-lg-6">
                                    <Label for="title">Title</Label>
                                    <Input type="text" name="title" id="title" placeholder="Enter title"
                                          value={Workouts.title} onChange={handleChange} 
                                          invalid={error.title ? true:false}
                                        />
                                    { error && <FormFeedback>{error.title}</FormFeedback> }
                                </FormGroup>

                                <div className="col-lg-6">
                                    <h4 className="mt-3 mb-0">Status</h4>
                                    <FormGroup check inline className="form-check-radio">
                                        <Label className="form-check-label">
                                            <Input type="radio" name="status" onChange={handleChange} value={1} invalid={error.status ? true:false}  checked={Workouts.status == "1" && true} />
                                            ON
                                            <span className="form-check-sign"></span>
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check inline className="form-check-radio">
                                        <Label className="form-check-label">
                                            <Input type="radio" name="status" onChange={handleChange} value={0} invalid={error.status ? true:false}  checked={Workouts.status == "0" && true} />
                                            OFF
                                            <span className="form-check-sign"></span>
                                        </Label>
                                    </FormGroup>
                                    { error && <FormFeedback>{error.status}</FormFeedback> }
                                </div>
                                <ImageUploder field_name={"image"} error={error} image_url={Workouts.image_url}  />
                                <VideoUploder field_name={"video"} error={error} video_url={Workouts.video_url}  /> 
                                <FormGroup className="col-lg-6">
                                    <Label for="category">Category</Label>
                                    <Input type="select" name="category" id="category" onChange={handleChange} invalid={error.category ? true:false} multiple > 
                                        <option disabled>Select</option>
                                        {HomeCategoriesLocal && HomeCategoriesLocal.map((home_categorie) => (
                                          <option key={home_categorie.id} selected={WorkoutCategoriesLocal.includes(home_categorie.id)} value={home_categorie.id}>{home_categorie.title}</option>
                                        ))}
                                    </Input>
                                    { error && <FormFeedback>{error.category}</FormFeedback> }
                                </FormGroup>
                                <TextAreaEditor value={Workouts.description} error={error} />
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
  workout: state.workoutsReducer.workout,
  errors: state.commonReducer.errors,
  home_categories: state.homeCategoriesReducer.home_categories,
})

const mapDispatchToProps = (dispatch) => ({
  WorkoutsViewAction: (id) => dispatch( WorkoutsViewAction(id) ),
  WorkoutsUpdateAction: (data, id, navigate) => dispatch( WorkoutsUpdateAction(data, id, navigate) ),
  getHomeCategoriesListAction: (data) => dispatch( getHomeCategoriesListAction(data) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutsEdit)