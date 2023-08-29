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
import { CalorieCalculationsCreateAction, CalorieByTitleSearchAction } from "../../redux/actions/calorieCalculationsAction";
import { getFoodTypesListAction } from "../../redux/actions/foodTypesAction";
import { connect } from "react-redux"
import APP_CONSTANTS from "../../constants/app.constant.js"
import SaveAndPublish from "../../components/Buttons/SaveAndPublish";
import Discart from "../../components/Buttons/Discart";

function CalorieCalculationsCreate (props) {
    const navigate = useNavigate()
    const [error, setError] = useState({});
    const [CalorieCalculationsLocal, setCalorieCalculationsLocal] = useState({
      title:"",
      quantity:"",
      calories_per_gram:0,
      food_type_id: 0,
    });
    useEffect(()=>{
      props.getFoodTypesListAction(1,APP_CONSTANTS.DEFAULT_LIMIT_WHEN_IN_SELECT);
    } , [])
    useEffect(()=>{
      if(props.errors) setError(props.errors);
    } , [props.errors])

    useEffect(()=>{
      if(props.calorie_by_title){
        if(props.calorie_by_title.response){
          setCalorieCalculationsLocal((currentState) => ({
            ...currentState,
            calories_per_gram: props.calorie_by_title.response.calories
          }));
        }
      } 
    } , [props.calorie_by_title])

    const handleChange = (e) => {
      setCalorieCalculationsLocal((currentState) => ({
        ...currentState,
        [e.target.name]: e.target.value
      }));
      setError({})
    }
    const CreateCalorieCalculationsFormSubmitHandle = (e) => {
      e.preventDefault();
      let formData = new FormData(e.target);
      props.CalorieCalculationsCreateAction(formData, navigate).then(response => {});
    }

    const SearchCaloriesClickHandler = () => {
      if(CalorieCalculationsLocal.title.length > 1){
        props.CalorieByTitleSearchAction(CalorieCalculationsLocal.title).then(response => {});
      }
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
                                          <Link to="/admin/calorieCalculations">
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
                                              <h5 className="card-title font-weight-bold">New Calorie Calculations</h5>
                                              <ul className="breadCrumbList">
                                                  <li><a path="/admin/dashboard" >Home</a></li>
                                                  <li><a path="/admin/Users" >Calorie Calculations</a></li>
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
                        <form onSubmit={CreateCalorieCalculationsFormSubmitHandle} enctype="multipart/form-data">
                            <div className="form-row">
                                <input type="hidden" name="status" id="status" value="1" />

                                <FormGroup className="col-lg-6">
                                    <Label for="title">Title</Label>
                                    <Row>
                                        <Col md="8">
                                            <Input type="text" name="title" id="title" placeholder="Enter title"
                                            invalid={error.title ? true:false} required onChange={handleChange} 
                                            />
                                        </Col>
                                        <Col md="4" className="pl-md-0">
                                            <button disabled={props.show_loder} type="button" onClick={()=>SearchCaloriesClickHandler()} className="btn btn-primary col-btn w-100" >Search Calories</button>
                                        </Col>
                                    </Row>
                                    { error && <FormFeedback>{error.title}</FormFeedback> }
                                </FormGroup>

                                <FormGroup className="col-lg-6">
                                    <Label for="quantity">Quantity</Label>
                                    <Input type="number" name="quantity" id="quantity" placeholder="Enter quantity"
                                          invalid={error.quantity ? true:false} required onChange={handleChange} 
                                        />
                                    { error && <FormFeedback>{error.quantity}</FormFeedback> }
                                </FormGroup>
                                <FormGroup className="col-lg-6">
                                    <Label for="calories_per_gram">Calories per gram</Label>
                                    <Input type="number" name="calories_per_gram" id="calories_per_gram" placeholder="Enter calories_per_gram"
                                          invalid={error.calories_per_gram ? true:false} value={CalorieCalculationsLocal.calories_per_gram} required onChange={handleChange} 
                                        />
                                    { error && <FormFeedback>{error.calories_per_gram}</FormFeedback> }
                                </FormGroup>

                                <FormGroup className="col-lg-6">
                                    <Label for="food_type_id">Food type id</Label>
                                    <Input type="select" name="food_type_id" id="food_type_id" onChange={handleChange} invalid={error.food_type_id ? true:false} > 
                                        <option disabled>Select</option>
                                        {props.food_types && props.food_types.map((home_categorie) => (
                                          <option key={home_categorie.id} value={home_categorie.id}>{home_categorie.title}</option>
                                        ))}
                                    </Input>
                                    { error && <FormFeedback>{error.food_type_id}</FormFeedback> }
                                </FormGroup>

                                <div className="col-lg-12">
                                    <div className="d-flex justify-content-end align-items-center w-100">
                                        <Discart status_field={true} back="calorieCalculations" />
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
  calorie_by_title: state.calorieCalculationsReducer.calorie_by_title,
  food_types: state.foodTypesReducer.food_types,
  errors: state.commonReducer.errors,
  show_loder: state.commonReducer.show_loder,
})

const mapDispatchToProps = (dispatch) => ({
  CalorieCalculationsCreateAction: (data, navigate) => dispatch( CalorieCalculationsCreateAction(data, navigate) ),
  getFoodTypesListAction: (data, limit) => dispatch( getFoodTypesListAction(data, limit) ),
  CalorieByTitleSearchAction: (title) => dispatch( CalorieByTitleSearchAction(title) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(CalorieCalculationsCreate)