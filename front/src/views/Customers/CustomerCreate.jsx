import React, { useState, useEffect } from "react";
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
import { CustomersCreateAction } from "../../redux/actions/customersAction";
import { connect } from "react-redux"
import SaveAndPublish from "../../components/Buttons/SaveAndPublish";
import Discart from "../../components/Buttons/Discart";

function CustomerCreate (props) {
    const navigate = useNavigate()
    const [error, setError] = useState({});
    const [imageUrl, setImageUrl] = useState(null);
    const imageHandleChange = (e) => {
      setImageUrl(e.target.value);
    };
    useEffect(()=>{
      if(props.errors) setError(props.errors);
    } , [props.errors])
  
    const handleChange = (e) => {
      setError({})
    }

    const CreateCustomerFormSubmitHandle = (e) => {
      e.preventDefault();
      let formData = new FormData(e.target);
      props.CustomersCreateAction(formData, navigate).then(response => {});
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
                                      <Link to="/admin/customers">
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
                                          <h5 className="card-title font-weight-bold">New Customer</h5>
                                          <ul className="breadCrumbList">
                                              <li><a path="/admin/dashboard" >Home</a></li>
                                              <li><a path="/admin/customers" >Customer</a></li>
                                              <li><a path="/admin/customers" >Create</a></li>
                                          </ul>
                                      </div>
                                  </div>
                              </div>
                          </Col>

                          <Col xl="8">
                              <div className="filter h-100 d-flex align-items-center justify-content-end">
                                  <div className="addNew">
                                      <Button color="default">
                                          discard
                                          <i className="fa fa-trash warning"/>{" "}
                                      </Button>

                                      <Button color="default">
                                          Save as Draft
                                          <i className="fa fa-save info"/>{" "}
                                      </Button>

                                      <Button color="primary">
                                          Save & Publish
                                          <i className="white">
                                              <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M8.98584 14.4586C9.39209 14.4586 9.73584 14.1461 9.73584 13.7086V7.45863H12.9546C13.6421 7.45863 13.9546 6.67738 13.4858 6.17738L8.01709 0.677383C7.70459 0.396133 7.23584 0.396133 6.95459 0.677383L1.45459 6.17738C0.98584 6.67738 1.29834 7.45863 1.98584 7.45863H5.23584V13.7086C5.23584 14.1461 5.54834 14.4586 5.98584 14.4586H8.98584Z" fill="white"/>
                                              </svg>
                                          </i>
                                      </Button>
                                  </div>
                              </div>
                          </Col>
                      </Row>
                    </div>
                  </CardBody>
                </Card>

                <Card className="guide-card workout">
                    <CardBody>
                        <form onSubmit={CreateCustomerFormSubmitHandle} enctype="multipart/form-data">
                            <div className="form-row">
                                <FormGroup className="col-lg-6">
                                    <Label for="full_name">Full Name</Label>
                                    <Input type="text" name="full_name" id="full_name" placeholder="Enter full_name"
                                          invalid={error.full_name ? true:false} required onChange={handleChange} 
                                        />
                                    { error && <FormFeedback>{error.full_name}</FormFeedback> }
                                </FormGroup>

                                <FormGroup className="col-lg-6">
                                    <Label for="email">Email</Label>
                                    <Input type="email" name="email" id="email" placeholder="Enter email"
                                          invalid={error.email ? true:false} required onChange={handleChange} 
                                        />
                                    { error && <FormFeedback>{error.email}</FormFeedback> }
                                </FormGroup>

                                <FormGroup className="col-lg-6">
                                        <Label for="password">Password</Label>
                                        <Input type="password" name="password" id="password" placeholder="Enter password"
                                          onChange={handleChange} required invalid={error.password ? true:false}
                                        />
                                        { error && <FormFeedback>{error.password}</FormFeedback> }
                                </FormGroup>

                                <div className="col-lg-6">
                                    <h4 className="mt-3 mb-0">Is verified</h4>
                                    <FormGroup check inline className="form-check-radio">
                                        <Label className="form-check-label">
                                            <Input type="radio" name="is_verified" onChange={handleChange} value={1} invalid={error.is_verified ? true:false} defaultChecked />
                                            ON
                                            <span className="form-check-sign"></span>
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check inline className="form-check-radio">
                                        <Label className="form-check-label">
                                            <Input type="radio" name="is_verified" onChange={handleChange} value={0} invalid={error.is_verified ? true:false} />
                                            OFF
                                            <span className="form-check-sign"></span>
                                        </Label>
                                    </FormGroup>
                                    { error && <FormFeedback>{error.status}</FormFeedback> }
                                </div>

                                <div className="col-lg-6">
                                    <h4 className="mt-3 mb-0">Status</h4>
                                    <FormGroup check inline className="form-check-radio">
                                        <Label className="form-check-label">
                                            <Input type="radio" name="status" onChange={handleChange} value={"active"} invalid={error.status ? true:false} defaultChecked />
                                            Active
                                            <span className="form-check-sign"></span>
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check inline className="form-check-radio">
                                        <Label className="form-check-label">
                                            <Input type="radio" name="status" onChange={handleChange} value={"in-active"} invalid={error.status ? true:false} />
                                            In Active
                                            <span className="form-check-sign"></span>
                                        </Label>
                                    </FormGroup>
                                    { error && <FormFeedback>{error.status}</FormFeedback> }
                                </div>

                                <FormGroup className="col-lg-6">
                                    <Label for="age">Age (optional)</Label>
                                    <Input type="number" name="age" id="age" placeholder="Enter age"
                                          invalid={error.age ? true:false} onChange={handleChange} 
                                        />
                                    { error && <FormFeedback>{error.age}</FormFeedback> }
                                </FormGroup>

                                <FormGroup className="col-lg-6">
                                    <Label for="weight">Weight in kg (optional)</Label>
                                    <Input type="number" name="weight" id="weight" placeholder="Enter weight"
                                          invalid={error.weight ? true:false} onChange={handleChange} 
                                        />
                                    { error && <FormFeedback>{error.weight}</FormFeedback> }
                                </FormGroup>

                                <FormGroup className="col-lg-6">
                                    <Label for="height">Height in feet (optional)</Label>
                                    <Input type="number" name="height" id="height" placeholder="Enter height"
                                          invalid={error.height ? true:false} onChange={handleChange} 
                                          min="3" max="9"
                                        />
                                    { error && <FormFeedback>{error.height}</FormFeedback> }
                                </FormGroup>

                                <FormGroup className="col-lg-6">
                                    <Label for="phoneNumber">Phone Number</Label>
                                    <Input type="number" name="phoneNumber" id="phoneNumber" placeholder="Enter phoneNumber"
                                          invalid={error.phoneNumber ? true:false} required onChange={handleChange} 
                                        />
                                    { error && <FormFeedback>{error.phoneNumber}</FormFeedback> }
                                </FormGroup>

                                <FormGroup className="col-lg-6">
                                    <Label for="title">Image Thumbnail</Label>
                                    <div className="tpfupload">
                                        <div className="fileBg">
                                            {imageUrl ? 
                                                <div>
                                                  <img alt="not fount" width={"250px"} src={URL.createObjectURL(imageUrl)} />
                                                  <button type="button" className="btn btn-danger" onClick={(event) => {
                                                      setImageUrl(null);
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
                                                setImageUrl(event.target.files[0]);
                                              }}
                                              invalid={error.image_url ? true:false}
                                            />
                                        </div>
                                        {
                                        !imageUrl && 
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
  CustomersCreateAction: (data, navigate) => dispatch( CustomersCreateAction(data, navigate) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomerCreate)