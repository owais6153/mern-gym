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
import { DailyTasksCreateAction } from "../../redux/actions/dailyTasksAction";
import { connect } from "react-redux"
import TextAreaEditor from "../../components/TextAreaEditor/TextAreaEditor";
import { getMealsListAction } from "../../redux/actions/mealsAction";
import { getWorkoutsListAction } from "../../redux/actions/workoutsAction";
import SaveAndPublish from "../../components/Buttons/SaveAndPublish";

function DailyTaskCreate (props) {
    const [answerInputList, setAnswerInputList] = useState([{ status:0, is_mandatory: 0, meal_plan_id:0, workout_id:0, title:"", description:"", milestone_type:null }]);
    const [limit] = useState(0);
    const navigate = useNavigate()
    const [error, setError] = useState({});
    const [DailyTaskTemp, setDailyTask] = useState({
      title:"",
      day:0,
      type:"",
      description: 0,
    });

    useEffect(()=>{
      props.getMealsListAction(1, limit).then(response => {});
      props.getWorkoutsListAction(1, limit).then(response => {});
    },[]);
    useEffect(()=>{
      if(props.errors) setError(props.errors);
    } , [props.errors])

    // handle input change
    const handleInputChange = (e, index) => {
      const { name, value } = e.target;
      const list = [...answerInputList];
      list[index][name] = value;
      setAnswerInputList(list);
    };
    // handle click event of the Remove button
    const handleRemoveClick = index => {
      const list = [...answerInputList];
      list.splice(index, 1);
      setAnswerInputList(list);
    };
    // handle click event of the Add button
    const handleAddClick = () => {
      setAnswerInputList([...answerInputList, { status:0, is_mandatory: 0, meal_plan_id:0, workout_id:0, title:"", description:"", milestone_type:null }]);
    };
    const handleChange = (e) => {
      setDailyTask((currentState) => ({
        ...currentState,
        [e.target.name]: e.target.value
      }));
      setError({})
    }
    const CreateDailyTaskFormSubmitHandle = (e) => {
      e.preventDefault();
      let formData = new FormData(e.target);
      props.DailyTasksCreateAction(formData, answerInputList, navigate).then(response => {});
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
                                              <h5 className="card-title font-weight-bold">New Daily Task</h5>
                                              <ul className="breadCrumbList">
                                                  <li><a path="/admin/dashboard" >Home</a></li>
                                                  <li><a path="/admin/Users" >Daily Task</a></li>
                                                  <li><a path="/admin/Users" >New</a></li>
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
                        <form onSubmit={CreateDailyTaskFormSubmitHandle} enctype="multipart/form-data">
                            <div className="form-row">
                                <input type="hidden" name="status" id="status" value="1" />

                                <FormGroup className="col-lg-6">
                                    <Label for="title">Title</Label>
                                    <Input type="text" name="title" id="title" placeholder="Enter title"
                                          invalid={error.title ? true:false} onChange={handleChange} 
                                        />
                                    { error && <FormFeedback>{error.title}</FormFeedback> }
                                </FormGroup>

                                <FormGroup className="col-lg-6">
                                    <Label for="day">Day</Label>
                                    <Input type="number" name="day" id="day" placeholder="Enter day"
                                          invalid={error.day ? true:false} onChange={handleChange} 
                                        />
                                    { error && <FormFeedback>{error.day}</FormFeedback> }
                                </FormGroup>
                                
                                <FormGroup className="col-lg-6">
                                    <Label for="type">Type</Label>
                                    <Input type="text" name="type" id="type" onChange={handleChange} invalid={error.type ? true:false} />
                                    { error && <FormFeedback>{error.type}</FormFeedback> }
                                </FormGroup>
                                <TextAreaEditor error={error} />
                                <div className="col-lg-12">
                                    <Label for="data_type">Milestones</Label>
                                    {answerInputList.map((x, i) => {
                                      return (
                                        <>
                                        <div className="box">
                                          <FormGroup check inline className="form-check-checkbox">
                                              <Label className="form-check-label">
                                                  <Input type="checkbox" name="milestone_type" checked={x.milestone_type == 1 && true} onChange={e => handleInputChange(e, i)} value={1}  />
                                                  Meal Plan
                                                  <span className="form-check-sign"></span>
                                              </Label>
                                          </FormGroup>
                                          <FormGroup check inline className="form-check-checkbox">
                                              <Label className="form-check-label">
                                                  <Input type="checkbox" name="milestone_type" checked={x.milestone_type == 2 && true} onChange={e => handleInputChange(e, i)} value={2} />
                                                  Workout
                                                  <span className="form-check-sign"></span>
                                              </Label>
                                          </FormGroup>
                                          <FormGroup check inline className="form-check-checkbox">
                                              <Label className="form-check-label">
                                                  <Input type="checkbox" name="milestone_type" checked={x.milestone_type == 3 && true} onChange={e => handleInputChange(e, i)} value={3} />
                                                  Other
                                                  <span className="form-check-sign"></span>
                                              </Label>
                                          </FormGroup>

                                          <div className="row">
                                          { x.milestone_type == 1 &&  
                                            <>
                                              <div className="col-lg-2">
                                                <h4 className="mt-3 mb-0">Is Mandatory</h4>
                                                <FormGroup check inline className="form-check-checkbox">
                                                  <Label className="form-check-label">
                                                      <Input type="checkbox" name="is_mandatory" checked={x.is_mandatory == 1 && true} onChange={e => handleInputChange(e, i)} value={1} />
                                                      YES
                                                      <span className="form-check-sign"></span>
                                                  </Label>
                                                </FormGroup>
                                                <FormGroup check inline className="form-check-checkbox">
                                                  <Label className="form-check-label">
                                                      <Input type="checkbox" name="is_mandatory" checked={x.is_mandatory == 0 && true} onChange={e => handleInputChange(e, i)} value={0} />
                                                      NO
                                                      <span className="form-check-sign"></span>
                                                  </Label>
                                                </FormGroup>
                                              </div>
                                              <FormGroup className="col-lg-8">
                                                <Label for="meal_plan_id">Select Meal Plan</Label>
                                                <Input type="select" name="meal_plan_id" id="meal_plan_id" onChange={e => handleInputChange(e, i)} >
                                                    <option disabled>Select</option>
                                                    {props.meals && props.meals.map((v,index)=><option value={v.id} key={index}>{v.title}</option>)}
                                                </Input>
                                              </FormGroup>
                                            </>
                                          }
                                          { x.milestone_type == 2 &&  
                                            <>
                                              <div className="col-lg-2">
                                                <h4 className="mt-3 mb-0">Is Mandatory</h4>
                                                <FormGroup check inline className="form-check-checkbox">
                                                  <Label className="form-check-label">
                                                      <Input type="checkbox" name="is_mandatory" checked={x.is_mandatory == 1 && true} onChange={e => handleInputChange(e, i)} value={1} />
                                                      YES
                                                      <span className="form-check-sign"></span>
                                                  </Label>
                                                </FormGroup>
                                                <FormGroup check inline className="form-check-checkbox">
                                                  <Label className="form-check-label">
                                                      <Input type="checkbox" name="is_mandatory" checked={x.is_mandatory == 0 && true} onChange={e => handleInputChange(e, i)} value={0} />
                                                      NO
                                                      <span className="form-check-sign"></span>
                                                  </Label>
                                                </FormGroup>
                                              </div>
                                              <FormGroup className="col-lg-8">
                                                <Label for="workout_id">Select Workouts</Label>
                                                <Input type="select" name="workout_id" id="workout_id" onChange={e => handleInputChange(e, i)} >
                                                    <option disabled>Select</option>
                                                    {props.workouts && props.workouts.map((v,index)=><option value={v.id} key={index}>{v.title}</option>)}
                                                </Input>
                                              </FormGroup>
                                            </>
                                          }
                                          { x.milestone_type == 3 &&  
                                            <>
                                              <div className="col-lg-2">
                                                <h4 className="mt-3 mb-0">Is Mandatory</h4>
                                                <FormGroup check inline className="form-check-checkbox">
                                                  <Label className="form-check-label">
                                                      <Input type="checkbox" name="is_mandatory" checked={x.is_mandatory == 1 && true} onChange={e => handleInputChange(e, i)} value={1} />
                                                      YES
                                                      <span className="form-check-sign"></span>
                                                  </Label>
                                                </FormGroup>
                                                <FormGroup check inline className="form-check-checkbox">
                                                  <Label className="form-check-label">
                                                      <Input type="checkbox" name="is_mandatory" checked={x.is_mandatory == 0 && true} onChange={e => handleInputChange(e, i)} value={0} />
                                                      NO
                                                      <span className="form-check-sign"></span>
                                                  </Label>
                                                </FormGroup>
                                              </div>
                                              <FormGroup className="col-lg-4">
                                                <Label for="title">Title</Label>
                                                <Input type="text" name="title" id="title" onChange={e => handleInputChange(e, i)} />
                                              </FormGroup>
                                              <FormGroup className="col-lg-4">
                                                <Label for="description">Description</Label>
                                                <Input type="text" name="description" id="description" onChange={e => handleInputChange(e, i)} />
                                              </FormGroup>
                                            </>
                                          }
                                            <div className="col-lg-2">
                                              <div className="btn-box">
                                                {answerInputList.length !== 1 && <Button color="danger" onClick={() => handleRemoveClick(i)}>Remove</Button>}
                                              </div>
                                            </div>
                                          </div>
                                          <hr />

                                          {answerInputList.length - 1 === i && 
                                            <div className="btn-box">
                                              <Button color="success" onClick={handleAddClick}>Add</Button>
                                            </div>
                                          }
                                        </div>
                                        </>
                                      );
                                    })}
                                </div>

                                <div className="col-lg-12">
                                    <div className="d-flex justify-content-end align-items-center w-100">
                                        <Button type="reset" color="default">
                                            discard
                                            <i className="fa fa-trash warning"/>{" "}
                                        </Button>

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
  // entities: state.entityAndAttributesReducer.entities,
  // attributes: state.entityAndAttributesReducer.attributes,
  meals: state.mealsReducer.meals,
  workouts: state.workoutsReducer.workouts,
})

const mapDispatchToProps = (dispatch) => ({
  DailyTasksCreateAction: (data, answerInputList, navigate) => dispatch( DailyTasksCreateAction(data, answerInputList, navigate) ),
  getMealsListAction: (data, limit) => dispatch( getMealsListAction(data, limit) ),
  getWorkoutsListAction: (data, limit) => dispatch( getWorkoutsListAction(data, limit) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(DailyTaskCreate)