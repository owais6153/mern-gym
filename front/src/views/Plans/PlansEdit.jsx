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
import moment from 'moment'
import { useNavigate } from "react-router-dom";
import { PlansViewAction, PlansUpdateAction } from "../../redux/actions/plansAction";
import { connect } from "react-redux"
import Loder from "../../components/Loder/Loder";

function PlansEdit (props) {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate()
    const [error, setError] = useState({});
    const [Plans, PlansData] = useState({
      id:(location.state?location.state.id:0),
    });
    
    useEffect(()=>{
      props.PlansViewAction(id).then(response => {});
    } , [])
    useEffect(()=>{
      if(props.errors) setError(props.errors);
    } , [props.errors])
    useEffect(()=>{
      if(props.plan) {
        PlansData((currentState) => ({
          ...currentState,
          ...props.plan,
          is_free: props.plan.isFree,
          effective_date: props.plan.effectiveDate,
          expiry_date: props.plan.expiryDate,
        }));
      }
    } , [props.plan])

    const handleChange = (e) => {
      PlansData((currentState) => ({
        ...currentState,
        [e.target.name]: e.target.value
      }));
      setError({})
    }
    const CreatePlansFormSubmitHandle = (e) => {
      e.preventDefault();
      let formData = new FormData(e.target);
      if(formData.getAll('effective_date') == '') formData.delete('effective_date');
      if(formData.getAll('expiry_date') == '') formData.delete('expiry_date');
      props.PlansUpdateAction(formData, Plans.id, navigate).then(response => {});
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
                                          <Link to="/admin/plans">
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
                                              <h5 className="card-title font-weight-bold">Edit Subscription Plans</h5>
                                              <ul className="breadCrumbList">
                                                  <li><a path="/admin/dashboard" >Home</a></li>
                                                  <li><a path="/admin/Users" >Subscription Plans</a></li>
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
                        <form onSubmit={CreatePlansFormSubmitHandle}>
                            <div className="form-row">
                                <FormGroup className="col-lg-6">
                                    <Label for="title">Title</Label>
                                    <Input type="text" name="title" id="title" placeholder="Enter title"
                                          value={Plans.title} onChange={handleChange} 
                                          invalid={error.title ? true:false}
                                        />
                                    { error && <FormFeedback>{error.title}</FormFeedback> }
                                </FormGroup>

                                <FormGroup className="col-lg-6">
                                    <Label for="weight">Weight</Label>
                                    <Input type="number" name="weight" id="weight" placeholder="Enter weight"
                                          value={Plans.weight} onChange={handleChange} 
                                          invalid={error.weight ? true:false}
                                        />
                                    { error && <FormFeedback>{error.weight}</FormFeedback> }
                                </FormGroup>

                                <FormGroup className="col-lg-6">
                                    <Label for="effective_date">Effective Date (optional)</Label>
                                    <Input type="date" name="effective_date" id="effective_date" placeholder="Enter effective_date"
                                          value={Plans.effective_date ? moment(Plans.effective_date).format('YYYY-MM-DD') : ''} onChange={handleChange} 
                                          invalid={error.effective_date ? true:false}
                                        />
                                    { error && <FormFeedback>{error.effective_date}</FormFeedback> }
                                </FormGroup>

                                <FormGroup className="col-lg-6">
                                    <Label for="expiry_date">Expiry Date (optional)</Label>
                                    <Input type="date" name="expiry_date" id="expiry_date" placeholder="Enter expiry_date"
                                          value={Plans.expiry_date ? moment(Plans.expiry_date).format('YYYY-MM-DD') : ''} onChange={handleChange} 
                                          invalid={error.expiry_date ? true:false}
                                        />
                                    { error && <FormFeedback>{error.expiry_date}</FormFeedback> }
                                </FormGroup>

                                <FormGroup className="col-lg-6">
                                    <Label for="price">Price</Label>
                                    <Input type="number" name="price" id="price" placeholder="Enter price"
                                          value={Plans.price} onChange={handleChange} 
                                          invalid={error.price ? true:false}
                                        />
                                    { error && <FormFeedback>{error.price}</FormFeedback> }
                                </FormGroup>
      
                                <div className="col-lg-6">
                                    <h4 className="mt-3 mb-0">Is free</h4>
                                    <FormGroup check inline className="form-check-radio">
                                        <Label className="form-check-label">
                                            <Input type="radio" name="is_free" onChange={handleChange} value={1} invalid={error.is_free ? true:false} checked={Plans.is_free == "1" && true} />
                                            ON
                                            <span className="form-check-sign"></span>
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check inline className="form-check-radio">
                                        <Label className="form-check-label">
                                            <Input type="radio" name="is_free" onChange={handleChange} value={0} invalid={error.is_free ? true:false} checked={Plans.is_free == "0" || Plans.is_free == null && true} />
                                            OFF
                                            <span className="form-check-sign"></span>
                                        </Label>
                                    </FormGroup>
                                    { error && <FormFeedback>{error.is_free}</FormFeedback> }
                                </div>

                                <FormGroup className="col-lg-6">
                                    <Label for="interval">Interval</Label>
                                    <Input type="select" name="interval" id="interval" onChange={handleChange} invalid={error.interval ? true:false} value={Plans.interval} > 

                                        <option disabled>Select</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="quarterly">Quarterly</option>
                                        <option value="half-yearly">Half-yearly</option>
                                        <option value="yearly">Yearly</option>
                                    </Input>
                                    { error && <FormFeedback>{error.interval}</FormFeedback> }
                                </FormGroup>

                                <div className="col-lg-6">
                                    <h4 className="mt-3 mb-0">Status</h4>
                                    <FormGroup check inline className="form-check-radio">
                                        <Label className="form-check-label">
                                            <Input type="radio" name="status" onChange={handleChange} value={"1"} invalid={error.status ? true:false} checked={Plans.status == "1" && true} />
                                            ON
                                            <span className="form-check-sign"></span>
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check inline className="form-check-radio">
                                        <Label className="form-check-label">
                                            <Input type="radio" name="status" onChange={handleChange} value={"0"} invalid={error.status ? true:false} checked={Plans.status == "0" && true} />
                                            OFF
                                            <span className="form-check-sign"></span>
                                        </Label>
                                    </FormGroup>
                                    { error && <FormFeedback>{error.status}</FormFeedback> }
                                </div>
                                
                                <FormGroup className="col-lg-6">
                                    <Label for="duration">Iuration</Label>
                                    <Input type="number" name="duration" id="duration" placeholder="Enter duration"
                                          value={Plans.duration} onChange={handleChange} 
                                          invalid={error.duration ? true:false}
                                        />
                                    { error && <FormFeedback>{error.duration}</FormFeedback> }
                                </FormGroup>

                                <div className="col-lg-12">
                                    <div className="d-flex justify-content-end align-items-center w-100">
                                        <Button type="reset" color="default">
                                            discard
                                            <i className="fa fa-trash warning"/>{" "}
                                        </Button>

                                        <Button type="submit" color="primary" disabled={props.show_loder == 1 ? true:false}>
                                            Save & Publish
                                            {
                                              props.show_loder == 1 ?
                                                <Loder />
                                              :
                                                <i className="white">
                                                    <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M8.98584 14.4586C9.39209 14.4586 9.73584 14.1461 9.73584 13.7086V7.45863H12.9546C13.6421 7.45863 13.9546 6.67738 13.4858 6.17738L8.01709 0.677383C7.70459 0.396133 7.23584 0.396133 6.95459 0.677383L1.45459 6.17738C0.98584 6.67738 1.29834 7.45863 1.98584 7.45863H5.23584V13.7086C5.23584 14.1461 5.54834 14.4586 5.98584 14.4586H8.98584Z" fill="white"/>
                                                    </svg>
                                                </i>
                                            } 
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
  plan: state.plansReducer.plan,
  errors: state.commonReducer.errors,
  show_loder: state.commonReducer.show_loder,
})

const mapDispatchToProps = (dispatch) => ({
  PlansUpdateAction: (data, id, navigate) => dispatch( PlansUpdateAction(data, id, navigate) ),
  PlansViewAction: (data) => dispatch( PlansViewAction(data) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(PlansEdit)