import React, { useState, useEffect } from "react";
import { useParams, useLocation } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
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
import { userUpdateAction, userViewAction } from "../../redux/actions/usersAction";
import { connect } from "react-redux"

function UserView (props) {
    const navigate = useNavigate()

    const { id } = useParams();
    const location = useLocation();
    useEffect(()=>{
      props.userViewAction(id).then(response => {});
    } , [])

    const [pageNumber, setPageNumber] = useState(1);
    const [error, setError] = useState({});
    const [user, userData] = useState({
      id: (location.state?location.state.user.id:0),
      status:(location.state?location.state.user.status:1),
    });

    useEffect(()=>{
      if(props.user_view) {
        userData((currentState) => ({
          ...currentState,
          ...props.user_view,
          is_verified:props.user_view.isVerified,
        }));
      }
    } , [props.user_view])

    useEffect(()=>{
      if(props.errors) setError(props.errors);
    } , [props.errors])
  
    const handleChange = (e) => {
      userData((currentState) => ({
        ...currentState,
        [e.target.name]: e.target.value
      }));
      setError({})
    }

    const EditUserFormSubmitHandle = (e) => {
      e.preventDefault();
      let formData = new FormData(e.target);
      props.userUpdateAction(formData, navigate).then(response => {});
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
                                  <Link to="/admin/users">
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
                                      <h5 className="card-title font-weight-bold">Edit User</h5>
                                      <ul className="breadCrumbList">
                                          <li><a path="/admin/dashboard" >Home</a></li>
                                          <li><a path="/admin/Users" >User</a></li>
                                          <li><a path="/admin/Users" >Edit</a></li>
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
                <form onSubmit={EditUserFormSubmitHandle}>
                  <input type="hidden" name="status" value="1" />
                  <div className="form-row">
                    {/* <div className="col-lg-6"> */}
                      <FormGroup className="col-lg-6">
                          <Label for="fullName">Name</Label>
                          <Input
                              type="text"
                              name="fullName"
                              id="fullName"
                              placeholder="Enter name"
                              value={user.fullName} onChange={handleChange} 
                              invalid={error.fullName ? true:false} 
                          />
                          { error && <FormFeedback>{error.fullName}</FormFeedback> }
                      </FormGroup>
                      <FormGroup className="col-lg-6">
                          <Label for="exampleEmail">Email address</Label>
                          <Input
                              type="email"
                              name="email"
                              id="exampleEmail"
                              placeholder="Enter email"
                              value={user.email} onChange={handleChange} 
                              invalid={error.email ? true:false} 
                          />
                          { error && <FormFeedback>{error.email}</FormFeedback> }
                      </FormGroup>
                      <FormGroup className="col-lg-6">
                          <Label for="weight">Weight</Label>
                          <Input
                              type="number"
                              name="weight"
                              id="weight"
                              placeholder="Enter weight"
                              value={user.weight} onChange={handleChange} 
                              invalid={error.weight ? true:false} 
                          />
                          { error && <FormFeedback>{error.weight}</FormFeedback> }
                      </FormGroup>
                      <div className="col-lg-6">
                          <h4 className="mt-3 mb-0">Is Verified</h4>
                          <FormGroup check inline className="form-check-radio">
                              <Label className="form-check-label">
                                  <Input type="radio" name="is_verified" onChange={handleChange} value={1} invalid={error.is_verified ? true:false} checked={user.is_verified == true && true} />
                                  ON
                                  <span className="form-check-sign"></span>
                              </Label>
                          </FormGroup>
                          <FormGroup check inline className="form-check-radio">
                              <Label className="form-check-label">
                                  <Input type="radio" name="is_verified" onChange={handleChange} value={0} invalid={error.is_verified ? true:false} checked={user.is_verified == false || user.is_verified == null  && true} />
                                  OFF
                                  <span className="form-check-sign"></span>
                              </Label>
                          </FormGroup>
                          { error && <FormFeedback>{error.is_verified}</FormFeedback> }
                      </div>
                    {/* </div> */}
                    
                    <div className="col-lg-12">
                      <div className="d-flex justify-content-end align-items-center w-100">
                          <Button type="reset" color="default">
                              discard
                              <i className="fa fa-trash warning"/>{" "}
                          </Button>

                          <Button color="default">
                              Save as Draft
                              <i className="fa fa-save info"/>{" "}
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
  user_view: state.usersReducer.user_view,
  users: state.usersReducer.users,
  total_users: state.usersReducer.total_users,
  users_pagination: state.usersReducer.users_pagination,
  errors: state.commonReducer.errors,
})

const mapDispatchToProps = (dispatch) => ({
  userUpdateAction: (data, navigate) => dispatch( userUpdateAction(data, navigate) ),
  userViewAction: (data) => dispatch( userViewAction(data) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserView)