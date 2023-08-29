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
    // Table,
} from "reactstrap";
import { getMealsListAction, MealsDeleteAction } from "../../redux/actions/mealsAction";
import { connect } from "react-redux"
// import Moment from 'react-moment';
import { useNavigate } from "react-router-dom";
import EditIcon from "../../components/Icons/EditIcon";
import DeleteIcon from "../../components/Icons/DeleteIcon";
import anime3 from '../../assets/img/anime3.png';
import Pagination from "../../components/Pagination/Pagination";

function Meals (props) {
    const navigate = useNavigate()
    const [currentPageNumber, setcurrentPageNumber] = useState(1);
    useEffect(()=>{
      if(currentPageNumber) props.getMealsListAction(currentPageNumber).then(response => {});
    },[currentPageNumber]);

    const deleteClickHandler = (id) => {
      props.MealsDeleteAction(id).then(response => {
        if(response) props.getMealsListAction(currentPageNumber);
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
										<CardTitle tag="h4">
                      Meal Plan
											<Badge color="info" pill>{props.meals_pagination.totalCount}</Badge>
										</CardTitle>
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
                      <Link to="/admin/meal/create">
												<Button color="primary">
													Create new Meal Plan
													<i className="fa fa-plus"/>{" "}
												</Button>
                      </Link>
											</div>
										</div>
									</Col>
								</Row>
							</CardHeader>

							<CardBody>
                <Row>
                  {props.meals && props.meals.map((meal) => (
                    <Col key={meal.id} lg="6">
                        <div className="tpf-horizontal-card p-3 with-bg my-2">
                            <Row>
                                <Col md="2">
                                    <figure className="figImage">
                                        <img src={meal.image_url ? meal.image_url : anime3} alt="..."/>
                                    </figure>
                                </Col>

                                <Col lg="6" className="d-flex align-items-center pl-0">
                                    <div className="title">
                                        <h5 className="card-title font-weight-bold">{meal.title}</h5>
                                        <p>{meal.description}</p>
                                    </div>
                                </Col>

                                <Col lg="4" className="d-flex justify-content-end">
                                    <Button color="info" className="tpf-btn mr-2" onClick={()=>{
                                      navigate('/admin/meal/edit/'+meal.id, { replace: true, state: meal })
                                    }}>
                                        <EditIcon />{" "}
                                    </Button>
                                    
                                    <Button color="warning" className="tpf-btn" onClick={()=>deleteClickHandler(meal.id)}>
                                        <DeleteIcon />
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                  ))}
                </Row>
                <Pagination
                      current_page={props.meals_pagination.currentPage}
                      limit={props.meals_pagination.limit}
                      previous={props.meals_pagination.previousPage}
                      next={props.meals_pagination.nextPage}
                      total_record={props.meals_pagination.totalCount}
                      total_pages={props.meals_pagination.totalPages}
                      setcurrentPageNumber={setcurrentPageNumber}
                    />
                {/* <div className="paging d-flex justify-content-end mt-3">
                    <Pagination aria-label="pagination">
                        <PaginationItem>
                            <PaginationLink previous href="#">
                                Previous
                            </PaginationLink>
                        </PaginationItem>

                        <div className="pages">
                            Page 
                            <a href="#"> 1 </a>
                            of
                            <a href="#"> 48 </a>
                        </div>

                        <PaginationItem>
                            <PaginationLink next href="#">
                                Next
                            </PaginationLink>
                        </PaginationItem>
                    </Pagination>
                </div> */}
							</CardBody>
						</Card>
					</Col>
				</Row>
      </div>        
    )
}

const mapStateToProps = state => ({
  meals: state.mealsReducer.meals,
  meals_pagination: state.mealsReducer.meals_pagination,
})

const mapDispatchToProps = (dispatch) => ({
  getMealsListAction: (data, navigate) => dispatch( getMealsListAction(data, navigate) ),
  MealsDeleteAction: (data, navigate) => dispatch( MealsDeleteAction(data, navigate) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Meals)