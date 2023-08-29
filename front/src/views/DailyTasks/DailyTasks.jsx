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
import { getDailyTasksListAction, DailyTasksDeleteAction } from "../../redux/actions/dailyTasksAction";
import { connect } from "react-redux"
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination/Pagination";
import EditIcon from "../../components/Icons/EditIcon";
import DeleteIcon from "../../components/Icons/DeleteIcon";

function DailyTasks (props) {
    const navigate = useNavigate()
    const [currentPageNumber, setcurrentPageNumber] = useState(1);
    useEffect(()=>{
      if(currentPageNumber) props.getDailyTasksListAction(currentPageNumber).then(response => {});
    },[currentPageNumber]);

    const deleteClickHandler = (id) => {
      props.DailyTasksDeleteAction(id).then(response => {
        if(response) props.getDailyTasksListAction(currentPageNumber);
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
                        Daily Tasks
                        <Badge color="info" pill>{props.daily_tasks_pagination && props.daily_tasks_pagination.totalCount}</Badge>
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
                          <Link to="/admin/dailyTask/create">
                            <Button color="primary">
                              Create new Daily Task
                              <i className="fa fa-plus"/>{" "}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>

                <CardBody className="pt-0">
                <Table responsive className="tablesorter tpf-table">
                      <thead className="text-primary">
                        <tr>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Day</th>
                          <th>Status</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {props.daily_tasks && props.daily_tasks.map((daily_tasks) => (
                          <tr key={daily_tasks.id}>
                            <td>{daily_tasks.id}</td>
                            <td>{daily_tasks.title}</td>
                            <td>{daily_tasks.day}</td>
                            <td>{daily_tasks.status === true ? "ON": "OFF"}</td>
                            <td className="text-right">
                              <Button className="btn-icon" color="success" size="sm" onClick={()=>{
                                navigate('/admin/dailyTask/edit/'+daily_tasks.id, { replace: true, state: daily_tasks })
                              }}>
                                <EditIcon />
                              </Button>{` `}
                              <Button className="btn-icon" color="warning" size="sm" onClick={()=>deleteClickHandler(daily_tasks.id)}>
                                <DeleteIcon />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Pagination 
                      current_page={props.daily_tasks_pagination.currentPage}
                      limit={props.daily_tasks_pagination.limit}
                      previous={props.daily_tasks_pagination.previousPage}
                      next={props.daily_tasks_pagination.nextPage}
                      total_record={props.daily_tasks_pagination.totalCount}
                      total_pages={props.daily_tasks_pagination.totalPages}
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
  daily_tasks: state.dailyTasksReducer.daily_tasks,
  daily_tasks_pagination: state.dailyTasksReducer.daily_tasks_pagination,
})

const mapDispatchToProps = (dispatch) => ({
  getDailyTasksListAction: (data, navigate) => dispatch( getDailyTasksListAction(data, navigate) ),
  DailyTasksDeleteAction: (data, navigate) => dispatch( DailyTasksDeleteAction(data, navigate) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(DailyTasks)