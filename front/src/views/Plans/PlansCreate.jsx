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
import { PlansCreateAction } from "../../redux/actions/plansAction";
import { connect } from "react-redux"
import Loder from "../../components/Loder/Loder";
import Discart from "../../components/Buttons/Discart";
import SaveAndPublish from "../../components/Buttons/SaveAndPublish";

function PlansCreate (props) {
    const navigate = useNavigate()
    const [error, setError] = useState({});
    useEffect(()=>{
      if(props.errors) setError(props.errors);
    } , [props.errors])

    const handleChange = (e) => {
      setError({})
    }
    const CreatePlansFormSubmitHandle = (e) => {
      e.preventDefault();
      let formData = new FormData(e.target);
      if(formData.getAll('effective_date') == '') formData.delete('effective_date');
      if(formData.getAll('expiry_date') == '') formData.delete('expiry_date');
      props.PlansCreateAction(formData, navigate).then(response => {});
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
                                              <h5 className="card-title font-weight-bold">New Subscription Plans</h5>
                                              <ul className="breadCrumbList">
                                                  <li><a path="/admin/dashboard" >Home</a></li>
                                                  <li><a path="/admin/Users" >Subscription Plans</a></li>
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
                        <form onSubmit={CreatePlansFormSubmitHandle}>
                            <div className="form-row">
                                <FormGroup className="col-lg-6">
                                    <Label for="title">Title</Label>
                                    <Input type="text" name="title" id="title" placeholder="Enter title"
                                          onChange={handleChange} 
                                          invalid={error.title ? true:false}
                                        />
                                    { error && <FormFeedback>{error.title}</FormFeedback> }
                                </FormGroup>

                                <FormGroup className="col-lg-6">
                                    <Label for="weight">Weight</Label>
                                    <Input type="number" name="weight" id="weight" placeholder="Enter weight"
                                          onChange={handleChange} 
                                          invalid={error.weight ? true:false}
                                        />
                                    { error && <FormFeedback>{error.weight}</FormFeedback> }
                                </FormGroup>

                                <FormGroup className="col-lg-6">
                                    <Label for="effective_date">Effective Date (optional)</Label>
                                    <Input type="date" name="effective_date" id="effective_date" placeholder="Enter effective date"
                                          onChange={handleChange} 
                                          invalid={error.effective_date ? true:false}
                                        />
                                    { error && <FormFeedback>{error.effective_date}</FormFeedback> }
                                </FormGroup>

                                <FormGroup className="col-lg-6">
                                    <Label for="expiry_date">Expiry Date (optional)</Label>
                                    <Input type="date" name="expiry_date" id="expiry_date" placeholder="Enter expiry date"
                                          onChange={handleChange} 
                                          invalid={error.expiry_date ? true:false}
                                        />
                                    { error && <FormFeedback>{error.expiry_date}</FormFeedback> }
                                </FormGroup>  

                                <FormGroup className="col-lg-6">
                                    <Label for="price">Price</Label>
                                    <Input type="number" name="price" id="price" placeholder="Enter price"
                                          onChange={handleChange} 
                                          invalid={error.price ? true:false}
                                        />
                                    { error && <FormFeedback>{error.price}</FormFeedback> }
                                </FormGroup>  

                                <div className="col-lg-6">
                                    <h4 className="mt-3 mb-0">Is free</h4>
                                    <FormGroup check inline className="form-check-radio">
                                        <Label className="form-check-label">
                                            <Input type="radio" name="is_free" onChange={handleChange} value={1} invalid={error.is_free ? true:false} defaultChecked />
                                            ON
                                            <span className="form-check-sign"></span>
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check inline className="form-check-radio">
                                        <Label className="form-check-label">
                                            <Input type="radio" name="is_free" onChange={handleChange} value={0} invalid={error.is_free ? true:false} />
                                            OFF
                                            <span className="form-check-sign"></span>
                                        </Label>
                                    </FormGroup>
                                    { error && <FormFeedback>{error.is_free}</FormFeedback> }
                                </div>

                                <FormGroup className="col-lg-6">
                                    <Label for="interval">Interval</Label>
                                    <Input type="select" name="interval" id="interval" onChange={handleChange} invalid={error.interval ? true:false} >
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
                                            <Input type="radio" name="status" onChange={handleChange} value={1} invalid={error.status ? true:false} defaultChecked />
                                            ON
                                            <span className="form-check-sign"></span>
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check inline className="form-check-radio">
                                        <Label className="form-check-label">
                                            <Input type="radio" name="status" onChange={handleChange} value={0} invalid={error.status ? true:false} />
                                            OFF
                                            <span className="form-check-sign"></span>
                                        </Label>
                                    </FormGroup>
                                    { error && <FormFeedback>{error.status}</FormFeedback> }
                                </div>

                                <FormGroup className="col-lg-6">
                                    <Label for="duration">Duration</Label>
                                    <Input type="number" name="duration" id="duration" placeholder="Enter duration"
                                          onChange={handleChange} 
                                          invalid={error.duration ? true:false}
                                        />
                                    { error && <FormFeedback>{error.duration}</FormFeedback> }
                                </FormGroup> 

                                <div className="col-lg-12">
                                    <div className="d-flex justify-content-end align-items-center w-100">
                                        <Discart status_field={true} back="plans" />
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
  show_loder: state.commonReducer.show_loder,
})

const mapDispatchToProps = (dispatch) => ({
  PlansCreateAction: (data, navigate) => dispatch( PlansCreateAction(data, navigate) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(PlansCreate)