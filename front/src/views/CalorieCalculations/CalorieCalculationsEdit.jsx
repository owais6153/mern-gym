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
import { CalorieCalculationsViewAction, CalorieCalculationsUpdateAction, CalorieByTitleSearchAction } from "../../redux/actions/calorieCalculationsAction";
import { getFoodTypesListAction } from "../../redux/actions/foodTypesAction";
import APP_CONSTANTS from "../../constants/app.constant.js"
import { connect } from "react-redux"

function CalorieCalculationsEdit (props) {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate()
    const [error, setError] = useState({});
    const [CalorieCalculations, CalorieCalculationsData] = useState({
      id:(location.state?location.state.id:0),
      title:(location.state?location.state.title:""),
      quantity:(location.state?location.state.quantity:""),
      calories_per_gram:(location.state?location.state.calories_per_gram:""),
      food_type_id:(location.state?(location.state.food_type_id == true?1:0):1),
    });
    useEffect(()=>{
      props.getFoodTypesListAction(1,APP_CONSTANTS.DEFAULT_LIMIT_WHEN_IN_SELECT);
    } , [])
    useEffect(()=>{
      if(props.errors) setError(props.errors);
    } , [props.errors])
    useEffect(()=>{
      props.CalorieCalculationsViewAction(id).then(response => {});
    } , [])

    useEffect(()=>{
      if(props.food_type) {
        CalorieCalculationsData((currentState) => ({
          ...currentState,
          ...props.food_type,
        }));
      }
    } , [props.food_type])

    useEffect(()=>{
      if(props.calorie_calculation) {
        CalorieCalculationsData((currentState) => ({
          ...currentState,
          ...props.calorie_calculation,
        }));
      }
    } , [props.calorie_calculation])

    const handleChange = (e) => {
      CalorieCalculationsData((currentState) => ({
        ...currentState,
        [e.target.name]: e.target.value
      }));
      setError({})
    }
    const FreateCalorieCalculationsFormSubmitHandle = (e) => {
      e.preventDefault();
      let formData = new FormData(e.target);
      props.CalorieCalculationsUpdateAction(formData, id, navigate).then(response => {});
    }

    const SearchCaloriesClickHandler = () => {
      if(CalorieCalculations.title.length > 1){
        props.CalorieByTitleSearchAction(CalorieCalculations.title).then(response => {});
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
                                              <h5 className="card-title font-weight-bold">Edit Calorie Calculations</h5>
                                              <ul className="breadCrumbList">
                                                  <li><a path="/admin/dashboard" >Home</a></li>
                                                  <li><a path="/admin/Users" >Calorie Calculations</a></li>
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
                        <form onSubmit={FreateCalorieCalculationsFormSubmitHandle}>
                            <div className="form-row">
                                <FormGroup className="col-lg-6">
                                    <Label for="title">Title</Label>
                                    <Row>
                                        <Col md="8">
                                            <Input type="text" name="title" id="title" placeholder="Enter title"
                                            invalid={error.title ? true:false} required onChange={handleChange} value={CalorieCalculations.title}
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
                                          value={CalorieCalculations.quantity} 
                                          invalid={error.quantity ? true:false} required onChange={handleChange} 
                                        />
                                    { error && <FormFeedback>{error.quantity}</FormFeedback> }
                                </FormGroup>

                                <FormGroup className="col-lg-6">
                                    <Label for="calories_per_gram">Calories per gram</Label>
                                    <Input type="number" name="calories_per_gram" id="calories_per_gram" placeholder="Enter calories_per_gram"
                                          value={CalorieCalculations.calories_per_gram} 
                                          invalid={error.calories_per_gram ? true:false} required onChange={handleChange} 
                                        />
                                    { error && <FormFeedback>{error.calories_per_gram}</FormFeedback> }
                                </FormGroup>

                                <FormGroup className="col-lg-6">
                                    <Label for="food_type_id">Food type id</Label>
                                    <Input type="select" name="food_type_id" id="food_type_id" onChange={handleChange} invalid={error.food_type_id ? true:false} value={CalorieCalculations.food_type_id} > 
                                        <option disabled>Select</option>
                                        {props.food_types && props.food_types.map((home_categorie) => (
                                          <option key={home_categorie.id} value={home_categorie.id}>{home_categorie.title}</option>
                                        ))}
                                    </Input>
                                    { error && <FormFeedback>{error.food_type_id}</FormFeedback> }
                                </FormGroup>

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
  calorie_calculation: state.calorieCalculationsReducer.calorie_calculation,
  food_types: state.foodTypesReducer.food_types,
  errors: state.commonReducer.errors,
})

const mapDispatchToProps = (dispatch) => ({
  CalorieCalculationsViewAction: (id) => dispatch( CalorieCalculationsViewAction(id) ),
  CalorieCalculationsUpdateAction: (data, id, navigate) => dispatch( CalorieCalculationsUpdateAction(data, id, navigate) ),
  getFoodTypesListAction: (data, limit) => dispatch( getFoodTypesListAction(data, limit) ),
  CalorieByTitleSearchAction: (title) => dispatch( CalorieByTitleSearchAction(title) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(CalorieCalculationsEdit)