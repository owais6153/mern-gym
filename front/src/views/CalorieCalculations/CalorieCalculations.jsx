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
    Table,
    Badge,
    FormGroup,
    Label,
    Input,
} from "reactstrap";
import { getCalorieCalculationsListAction, CalorieCalculationsDeleteAction } from "../../redux/actions/calorieCalculationsAction";
import { connect } from "react-redux"
import Pagination from "../../components/Pagination/Pagination";
import EditIcon from "../../components/Icons/EditIcon";
import DeleteIcon from "../../components/Icons/DeleteIcon";
import Moment from 'react-moment';
import { useNavigate } from "react-router-dom";

function CalorieCalculations (props) {
    const navigate = useNavigate()
    const [currentPageNumber, setcurrentPageNumber] = useState(1);
    useEffect(()=>{
      if(currentPageNumber) props.getCalorieCalculationsListAction(currentPageNumber).then(response => {});
    },[currentPageNumber]);

    const deleteClickHandler = (id) => {
      props.CalorieCalculationsDeleteAction(id).then(response => {
        if(response) props.getCalorieCalculationsListAction(currentPageNumber);
      });
    }

    return (
        <>
          <div className="content">
            <Row>
              <Col md="12">
                <Card className="card-plain tpf-card">
                <CardHeader>
                    <Row>
                      <Col md="4">
                        <CardTitle tag="h4">
                          Calorie Calculations
                          <Badge color="info" pill>{props.calorie_calculations_pagination.totalCount}</Badge>
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
                          <div className="searchBox">
                            <FormGroup className="no-border">
                              <Input type="text" placeholder="Search"/>
                            </FormGroup>

                            <Button color="link" className="btn-icon btn-round">
                              <i className="fa fa-search"></i>
                            </Button>
                          </div>

                          <div className="addNew">
                            <Link to="/admin/calorieCalculation/create">
                              <Button color="primary">
                                Create new Calorie Calculation
                                <i className="fa fa-plus"/>{" "}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </CardHeader>

                  <CardBody>
                    <Table responsive className="tablesorter tpf-table">
                      <thead className="text-primary">
                        <tr>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Quantity</th>
                          <th>Calories per gram</th>
                          {/* <th>UPLOADED</th> */}
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {props.calorie_calculations.map((calorie_calculations) => (
                          <tr key={calorie_calculations.id}>
                            <td>{calorie_calculations.id}</td>
                            <td>{calorie_calculations.title}</td>
                            <td>{calorie_calculations.quantity}</td>
                            <td>{calorie_calculations.calories_per_gram}</td>
                            {/* <td className="text-center">
                              <Moment format="DD/MMM/YYYY">{calorie_calculations.createdAt}</Moment>
                            </td>                             */}
                            <td className="text-right">
                              <Button className="btn-icon" color="success" size="sm" onClick={()=>{
                                navigate('/admin/calorieCalculation/edit/'+calorie_calculations.id, { replace: true, state: calorie_calculations })
                              }}>
                                <EditIcon />
                              </Button>{` `}
                              <Button className="btn-icon" color="warning" size="sm" onClick={()=>deleteClickHandler(calorie_calculations.id)}>
                                <DeleteIcon />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Pagination 
                      current_page={props.calorie_calculations_pagination.currentPage}
                      limit={props.calorie_calculations_pagination.limit}
                      previous={props.calorie_calculations_pagination.previousPage}
                      next={props.calorie_calculations_pagination.nextPage}
                      total_record={props.calorie_calculations_pagination.totalCount}
                      total_pages={props.calorie_calculations_pagination.totalPages}
                      setcurrentPageNumber={setcurrentPageNumber}
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </>
    )
}

const mapStateToProps = state => ({
  calorie_calculations: state.calorieCalculationsReducer.calorie_calculations,
  calorie_calculations_pagination: state.calorieCalculationsReducer.calorie_calculations_pagination,
})

const mapDispatchToProps = (dispatch) => ({
  getCalorieCalculationsListAction: (data, navigate) => dispatch( getCalorieCalculationsListAction(data, navigate) ),
  CalorieCalculationsDeleteAction: (data, navigate) => dispatch( CalorieCalculationsDeleteAction(data, navigate) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(CalorieCalculations)