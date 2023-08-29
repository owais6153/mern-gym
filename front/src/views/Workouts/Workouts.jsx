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
import { getWorkoutsListAction, WorkoutsDeleteAction } from "../../redux/actions/workoutsAction";
import { connect } from "react-redux"
import Pagination from "../../components/Pagination/Pagination";
import EditIcon from "../../components/Icons/EditIcon";
import DeleteIcon from "../../components/Icons/DeleteIcon";
// import Moment from 'react-moment';
import { useNavigate } from "react-router-dom";

function Workouts (props) {
    const navigate = useNavigate()
    const [currentPageNumber, setcurrentPageNumber] = useState(1);
    useEffect(()=>{
      if(currentPageNumber) props.getWorkoutsListAction(currentPageNumber).then(response => {});
    },[currentPageNumber]);

    const deleteClickHandler = (id) => {
      props.WorkoutsDeleteAction(id).then(response => {
        if(response) props.getWorkoutsListAction(currentPageNumber);
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
                          Workouts
                          <Badge color="info" pill>{props.workouts_pagination ? props.workouts_pagination.totalCount:0}</Badge>
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
                            <Link to="/admin/workout/create">
                              <Button color="primary">
                                Create new Workouts
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
                          <th>Status</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {props.workouts && props.workouts.map((workout) => (
                          <tr key={workout.id}>
                            <td>{workout.id}</td>
                            <td>{workout.title}</td>
                            <td>{workout.status === true ? "ON": "OFF"}</td>
                            <td className="text-right">
                              <Button className="btn-icon" color="success" size="sm" onClick={()=>{
                                navigate('/admin/workout/edit/'+workout.id, { replace: true, state: workout })
                              }}>
                                <EditIcon />
                              </Button>{` `}
                              <Button className="btn-icon" color="warning" size="sm" onClick={()=>deleteClickHandler(workout.id)}>
                                <DeleteIcon />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Pagination 
                      current_page={props.workouts_pagination.currentPage}
                      limit={props.workouts_pagination.limit}
                      previous={props.workouts_pagination.previousPage}
                      next={props.workouts_pagination.nextPage}
                      total_record={props.workouts_pagination.totalCount}
                      total_pages={props.workouts_pagination.totalPages}
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
  workouts: state.workoutsReducer.workouts,
  workouts_pagination: state.workoutsReducer.workouts_pagination,
})

const mapDispatchToProps = (dispatch) => ({
  getWorkoutsListAction: (data, navigate) => dispatch( getWorkoutsListAction(data, navigate) ),
  WorkoutsDeleteAction: (data, navigate) => dispatch( WorkoutsDeleteAction(data, navigate) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Workouts)