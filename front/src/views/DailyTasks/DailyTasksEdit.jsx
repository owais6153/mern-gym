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
import { DailyTasksUpdateAction, DailyTasksViewAction } from "../../redux/actions/dailyTasksAction";
import TextAreaEditor from "../../components/TextAreaEditor/TextAreaEditor";
import { getMealsListAction } from "../../redux/actions/mealsAction";
import { getWorkoutsListAction } from "../../redux/actions/workoutsAction";
import { connect } from "react-redux"
var _ = require('lodash');

function DailyTasksEdit (props) {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate()
    const [error, setError] = useState({});
    const [DailyTasks, DailyTasksData] = useState({
      id:(location.state?location.state.id:0),
      title:(location.state?location.state.title:""),
      type:(location.state?location.state.type:""),
      status:(location.state?(location.state.status == true?1:0):1),
      milestones:(location.state?(location.state.milestones):[]),
    });
    const [answerInputList, setAnswerInputList] = useState(DailyTasks.milestones);
    const [limit] = useState(0);

    useEffect(()=>{
      props.getMealsListAction(1, limit).then(response => {});
      props.getWorkoutsListAction(1, limit).then(response => {});
    },[]);
    useEffect(()=>{
      if(props.errors) setError(props.errors);
    } , [props.errors])
    useEffect(()=>{
      props.DailyTasksViewAction(id).then(response => {});
    } , [])
    useEffect(()=>{
      if(props.daily_task) {
        DailyTasksData((currentState) => ({
          ...currentState,
          ...props.daily_task,
        }));
        if(DailyTasks.milestones){
          // {"title":"","day":0,"type":"","description":0}[{"status":0,"is_mandatory":0,"meal_plan_id":0,"workout_id":0,"title":"","description":"","milestone_type":null}]
          // [{"id":10,"image_url":null,"title":null,"description":null,"status":false,"mealPlan":null,"is_mandatory":true,"workout":{"id":1,"title":"Rerum reiciendis com","description":"Aut vitae doloribus","status":true,"image_url":"https://the-prime-fit.s3.eu-west-2.amazonaws.com/default/1676191779489-H.jpg","video_url":"https://the-prime-fit.s3.eu-west-2.amazonaws.com/default/1676191780684-butterfly_flower_insect_nature_515.mp4","createdAt":"2023-02-12T08:49:43.000Z","updatedAt":"2023-02-12T09:10:43.000Z","deletedAt":null},"createdAt":"2023-02-14T23:23:13.000Z","updatedAt":"2023-02-14T23:23:13.000Z","milestone_type":2},{"id":9,"image_url":null,"title":null,"description":null,"status":false,"mealPlan":{"id":5,"title":"Dolor error nulla mi","description":"Nulla error atque co","status":false,"image_url":"https://the-prime-fit.s3.eu-west-2.amazonaws.com/default/1676204091988-IMG_20220103_120700-removebg-preview.png","keywords":null,"createdAt":"2023-02-04T14:25:36.000Z","updatedAt":"2023-02-12T12:14:53.000Z","deletedAt":null},"is_mandatory":true,"workout":null,"createdAt":"2023-02-14T23:23:13.000Z","updatedAt":"2023-02-14T23:23:13.000Z","milestone_type":1},{"id":11,"image_url":null,"title":"tit3","description":"des3","status":false,"mealPlan":null,"is_mandatory":true,"workout":null,"createdAt":"2023-02-14T23:23:13.000Z","updatedAt":"2023-02-14T23:23:13.000Z","milestone_type":3}]
          let array_temp = [];
          _.forEach(DailyTasks.milestones, function(value, key) {
            if(!value.mealPlan && !value.workout) value.milestone_type = 3; 
            if(!value.mealPlan && !value.title && !value.description) value.milestone_type = 2; 
            if(!value.workout && !value.title && !value.description) value.milestone_type = 1; 
            if(value.mealPlan) value.meal_plan_id = value.mealPlan.id; 
            if(value.workout) value.workout_id = value.workout.id; 
            if(value.is_mandatory == true) value.is_mandatory = 1; 
            else value.is_mandatory = 0; 
            if(value.status == true) value.status = 1; 
            else value.status = 0; 
            // console.log(value)
            array_temp.push(value);
          });
          console.log(array_temp);

        }
      }
    } , [props.daily_task])

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
      DailyTasksData((currentState) => ({
        ...currentState,
        [e.target.name]: e.target.value
      }));
      setError({})
    }
    const CreateDailyTasksFormSubmitHandle = (e) => {
      e.preventDefault();
      let formData = new FormData(e.target);
      props.DailyTasksUpdateAction(formData, DailyTasks.id, [...answerInputList], navigate).then(response => {});
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
                                              <h5 className="card-title font-weight-bold">Edit Daily Task</h5>
                                              <ul className="breadCrumbList">
                                                  <li><a path="/admin/dashboard" >Home</a></li>
                                                  <li><a path="/admin/Users" >Daily Task</a></li>
                                                  <li><a path="/admin/Users" >Edit </a></li>
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
                        <form onSubmit={CreateDailyTasksFormSubmitHandle}>
                            <div className="form-row">
                                <FormGroup className="col-lg-6">
                                    <Label for="title">Title</Label>
                                    <Input type="text" name="title" id="title" placeholder="Enter title"
                                          value={DailyTasks.title} onChange={handleChange} 
                                          invalid={error.title ? true:false}
                                        />
                                    { error && <FormFeedback>{error.title}</FormFeedback> }
                                </FormGroup>

                                <FormGroup className="col-lg-6">
                                    <Label for="day">Day</Label>
                                    <Input type="number" name="day" id="day" onChange={handleChange} 
                                      invalid={error.day ? true:false}
                                      value={DailyTasks.day} 
                                    />
                                    { error && <FormFeedback>{error.day}</FormFeedback> }
                                </FormGroup>

                                <FormGroup className="col-lg-6">
                                    <Label for="type">Type</Label>
                                    <Input type="text" name="type" id="type" onChange={handleChange} 
                                      invalid={error.type ? true:false}
                                      value={DailyTasks.type} 
                                    />
                                    { error && <FormFeedback>{error.type}</FormFeedback> }
                                </FormGroup>
                                <TextAreaEditor value={DailyTasks.description}  error={error} />
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
                                              <div className="col-lg-2">
                                                <h4 className="mt-3 mb-0">Status</h4>
                                                <FormGroup check inline className="form-check-checkbox">
                                                  <Label className="form-check-label">
                                                      <Input type="checkbox" name="status" checked={x.status == 1 && true} onChange={e => handleInputChange(e, i)} value={1} />
                                                      YES
                                                      <span className="form-check-sign"></span>
                                                  </Label>
                                                </FormGroup>
                                                <FormGroup check inline className="form-check-checkbox">
                                                  <Label className="form-check-label">
                                                      <Input type="checkbox" name="status" checked={x.status == 0 && true} onChange={e => handleInputChange(e, i)} value={0} />
                                                      NO
                                                      <span className="form-check-sign"></span>
                                                  </Label>
                                                </FormGroup>
                                              </div>
                                              <FormGroup className="col-lg-6">
                                                <Label for="meal_plan_id">Select Meal Plan</Label>
                                                <Input type="select" name="meal_plan_id" id="meal_plan_id" onChange={e => handleInputChange(e, i)} >
                                                    <option disabled>Select</option>
                                                    {props.meals && props.meals.map((v,index)=><option value={v.id} selected={x.meal_plan_id == v.id} key={index}>{v.title}</option>)}
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
                                              <div className="col-lg-2">
                                                <h4 className="mt-3 mb-0">Status</h4>
                                                <FormGroup check inline className="form-check-checkbox">
                                                  <Label className="form-check-label">
                                                      <Input type="checkbox" name="status" checked={x.status == 1 && true} onChange={e => handleInputChange(e, i)} value={1} />
                                                      YES
                                                      <span className="form-check-sign"></span>
                                                  </Label>
                                                </FormGroup>
                                                <FormGroup check inline className="form-check-checkbox">
                                                  <Label className="form-check-label">
                                                      <Input type="checkbox" name="status" checked={x.status == 0 && true} onChange={e => handleInputChange(e, i)} value={0} />
                                                      NO
                                                      <span className="form-check-sign"></span>
                                                  </Label>
                                                </FormGroup>
                                              </div>
                                              <FormGroup className="col-lg-6">
                                                <Label for="workout_id">Select Workouts</Label>
                                                <Input type="select" name="workout_id" id="workout_id" onChange={e => handleInputChange(e, i)} >
                                                    <option disabled>Select</option>
                                                    {props.workouts && props.workouts.map((v,index)=><option selected={x.workout_id == v.id} value={v.id} key={index}>{v.title}</option>)}
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
                                              <div className="col-lg-2">
                                                <h4 className="mt-3 mb-0">Status</h4>
                                                <FormGroup check inline className="form-check-checkbox">
                                                  <Label className="form-check-label">
                                                      <Input type="checkbox" name="status" checked={x.status == 1 && true} onChange={e => handleInputChange(e, i)} value={1} />
                                                      YES
                                                      <span className="form-check-sign"></span>
                                                  </Label>
                                                </FormGroup>
                                                <FormGroup check inline className="form-check-checkbox">
                                                  <Label className="form-check-label">
                                                      <Input type="checkbox" name="status" checked={x.status == 0 && true} onChange={e => handleInputChange(e, i)} value={0} />
                                                      NO
                                                      <span className="form-check-sign"></span>
                                                  </Label>
                                                </FormGroup>
                                              </div>
                                              <FormGroup className="col-lg-3">
                                                <Label for="title">Title</Label>
                                                <Input type="text" name="title" id="title" value={x.title} onChange={e => handleInputChange(e, i)} />
                                              </FormGroup>
                                              <FormGroup className="col-lg-3">
                                                <Label for="description">Description</Label>
                                                <Input type="text" name="description" value={x.description} id="description" onChange={e => handleInputChange(e, i)} />
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
  daily_task: state.dailyTasksReducer.daily_task,
  // entities: state.entityAndAttributesReducer.entities,
  // attributes: state.entityAndAttributesReducer.attributes,
  meals: state.mealsReducer.meals,
  workouts: state.workoutsReducer.workouts,
})

const mapDispatchToProps = (dispatch) => ({
  DailyTasksUpdateAction: (data, id, answerInputList, navigate) => dispatch( DailyTasksUpdateAction(data, id, answerInputList, navigate) ),
  DailyTasksViewAction: (id) => dispatch( DailyTasksViewAction(id) ),
  getMealsListAction: (data, limit) => dispatch( getMealsListAction(data, limit) ),
  getWorkoutsListAction: (data, limit) => dispatch( getWorkoutsListAction(data, limit) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(DailyTasksEdit)