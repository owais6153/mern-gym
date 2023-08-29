import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { 
    Card, 
    CardBody, 
    CardHeader, 
    CardTitle,
    Row, 
    Col,
    Button,
    FormGroup,
    Label,
    Input,
    Badge,
    Table,
} from "reactstrap";
import { getPlansListAction, PlansDeleteAction } from "../../redux/actions/plansAction";
import { connect } from "react-redux"
import Moment from 'react-moment';
import { useNavigate } from "react-router-dom";
import EditIcon from "../../components/Icons/EditIcon";
import DeleteIcon from "../../components/Icons/DeleteIcon";

function Plans (props) {
    const navigate = useNavigate()
    const [currentPageNumber, setcurrentPageNumber] = useState(1);
    useEffect(()=>{
      if(currentPageNumber) props.getPlansListAction(currentPageNumber).then(response => {});
    },[currentPageNumber]);

    const deleteClickHandler = (id) => {
      props.PlansDeleteAction(id).then(response => {
        if(response) props.getPlansListAction(currentPageNumber);
      });
    }
    return (
      <div className="content">
				<Row>
					<Col md="12">
						<Card className="card-plain tpf-card">
							<CardHeader>
								<Row>
									<Col md="4">
										<CardTitle tag="h4">Subscription Plans<Badge color="info" pill>{props.plans.length}</Badge></CardTitle>
										{/* <p className="category">Sort by:</p> */}
										<div className="selectDown">
											<FormGroup>
												<Label for="sortBy">Sort by:</Label>
												<Input type="select" name="sortBy" id="SortsortByBy" >
													<option>Recent</option>
													<option>...</option>
												</Input>
											</FormGroup>
										</div>
									</Col>

									<Col>
										<div className="filter">
											<div className="addNew">
                        <Link to="/admin/plan/create">
                            <Button color="primary">
                                Create new Plans
                                <i className="fa fa-plus"></i>
                            </Button>
                        </Link>
											</div>
										</div>
									</Col>
								</Row>
							</CardHeader>

							<CardBody>
                <Row>
                    {props.plans && props.plans.map((plans) => (
                        <Col lg="4" key={plans.id}>
                            <Card className="plans-card">
                                <CardHeader>
                                    <Row className="mb-2">
                                        <Col lg="6">
                                            <h6>{plans.title}</h6>
                                            
                                            { plans.isFree == true ? 
                                                <h4>Free Trial</h4>
                                              :
                                                <h4>
                                                    $ {plans.price}
                                                    <small>/{plans.interval}</small>
                                                </h4>
                                            }
                                        </Col>

                                        <Col lg="6" className="d-flex justify-content-end align-items-center">
                                            <Button className="btn-icon" color="info" size="sm" onClick={()=>{
                                              navigate('/admin/plan/edit/'+plans.id, { replace: true, state: plans })
                                            }}>
                                                <EditIcon />
                                            </Button>{` `}
                                            <Button className="btn-icon" color="warning" size="sm" onClick={()=>deleteClickHandler(plans.id)}>
                                                <DeleteIcon />
                                            </Button>
                                        </Col>
                                    </Row>

                                    <hr />
                                </CardHeader>

                                <CardBody>
                                    <ul className="list">
                                        <li className="item">
                                            <span className="icon">
                                                <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M15.3605 0.911133L5.6007 10.6709L2.0382 7.07129C1.85265 6.92285 1.55578 6.92285 1.40734 7.07129L0.331169 8.14746C0.182732 8.2959 0.182732 8.59277 0.331169 8.77832L5.30383 13.7139C5.48937 13.8994 5.74914 13.8994 5.93468 13.7139L17.0675 2.58105C17.2159 2.43262 17.2159 2.13574 17.0675 1.9502L15.9913 0.911133C15.8429 0.725586 15.546 0.725586 15.3605 0.911133Z" fill="#188E40"/>
                                                </svg>
                                            </span>
                                            <span className="itemText">Lifestyle Coaching: 3 Days</span>
                                        </li>

                                        <li className="item">
                                            <span className="icon">
                                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.13535 7.16895L13.776 2.57129C14.0338 2.31348 14.0338 1.84082 13.776 1.58301L12.7018 0.508789C12.4439 0.250977 11.9713 0.250977 11.7135 0.508789L7.11582 5.14941L2.47519 0.508789C2.21738 0.250977 1.74473 0.250977 1.48691 0.508789L0.412695 1.58301C0.154882 1.84082 0.154882 2.31348 0.412695 2.57129L5.05332 7.16895L0.412695 11.8096C0.154882 12.0674 0.154882 12.54 0.412695 12.7979L1.48691 13.8721C1.74473 14.1299 2.21738 14.1299 2.47519 13.8721L7.11582 9.23145L11.7135 13.8721C11.9713 14.1299 12.4439 14.1299 12.7018 13.8721L13.776 12.7979C14.0338 12.54 14.0338 12.0674 13.776 11.8096L9.13535 7.16895Z" fill="#973737"/>
                                                </svg>
                                            </span>
                                            <span className="itemText">Workout Programs</span>
                                        </li>

                                        <li className="item">
                                            <span className="icon">
                                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.13535 7.16895L13.776 2.57129C14.0338 2.31348 14.0338 1.84082 13.776 1.58301L12.7018 0.508789C12.4439 0.250977 11.9713 0.250977 11.7135 0.508789L7.11582 5.14941L2.47519 0.508789C2.21738 0.250977 1.74473 0.250977 1.48691 0.508789L0.412695 1.58301C0.154882 1.84082 0.154882 2.31348 0.412695 2.57129L5.05332 7.16895L0.412695 11.8096C0.154882 12.0674 0.154882 12.54 0.412695 12.7979L1.48691 13.8721C1.74473 14.1299 2.21738 14.1299 2.47519 13.8721L7.11582 9.23145L11.7135 13.8721C11.9713 14.1299 12.4439 14.1299 12.7018 13.8721L13.776 12.7979C14.0338 12.54 14.0338 12.0674 13.776 11.8096L9.13535 7.16895Z" fill="#973737"/>
                                                </svg>
                                            </span>
                                            <span className="itemText">Meal Options, Recipes </span>
                                        </li>

                                        <li className="item">
                                            <span className="icon">
                                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.13535 7.16895L13.776 2.57129C14.0338 2.31348 14.0338 1.84082 13.776 1.58301L12.7018 0.508789C12.4439 0.250977 11.9713 0.250977 11.7135 0.508789L7.11582 5.14941L2.47519 0.508789C2.21738 0.250977 1.74473 0.250977 1.48691 0.508789L0.412695 1.58301C0.154882 1.84082 0.154882 2.31348 0.412695 2.57129L5.05332 7.16895L0.412695 11.8096C0.154882 12.0674 0.154882 12.54 0.412695 12.7979L1.48691 13.8721C1.74473 14.1299 2.21738 14.1299 2.47519 13.8721L7.11582 9.23145L11.7135 13.8721C11.9713 14.1299 12.4439 14.1299 12.7018 13.8721L13.776 12.7979C14.0338 12.54 14.0338 12.0674 13.776 11.8096L9.13535 7.16895Z" fill="#973737"/>
                                                </svg>
                                            </span>
                                            <span className="itemText">Consistency Calendar</span>
                                        </li>
                                    </ul>
                                </CardBody>
                            </Card>
                        </Col>
                    ))}
                </Row>
							</CardBody>
						</Card>
					</Col>
				</Row>
      </div>
    )
}

const mapStateToProps = state => ({
  plans: state.plansReducer.plans,
  plans_pagination: state.plansReducer.plans_pagination,
})

const mapDispatchToProps = (dispatch) => ({
  getPlansListAction: (data, navigate) => dispatch( getPlansListAction(data, navigate) ),
  PlansDeleteAction: (data, navigate) => dispatch( PlansDeleteAction(data, navigate) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Plans)