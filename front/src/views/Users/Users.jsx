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
import anime3 from '../../assets/img/anime3.png';
import { getUsersListAction } from "../../redux/actions/usersAction";
import { connect } from "react-redux"
import Pagination from "../../components/Pagination/Pagination";
import Moment from 'react-moment';
import { useNavigate } from "react-router-dom";
import VeiwIcon from "../../components/Icons/ViewIcon";
import EditIcon from "../../components/Icons/EditIcon";
import DeleteIcon from "../../components/Icons/DeleteIcon";

function Users (props) {
    const navigate = useNavigate()
    const [currentPageNumber, setcurrentPageNumber] = useState(1);
    useEffect(()=>{
      if(currentPageNumber) props.getUsersListAction(currentPageNumber).then(response => {});
    },[currentPageNumber]);
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
                          Users
                          <Badge color="info" pill>{props.users_pagination.totalCount}</Badge>
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
                            <Link to="/admin/user/create">
                              <Button color="primary">
                                Create new User
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
                          <th className="tablecheck">
                            <FormGroup check>
                              <Label check>
                                <Input type="checkbox" />{' '}
                                <span className="form-check-sign">
                                  <span className="check"></span>
                                </span>
                              </Label>
                            </FormGroup>
                          </th>
                          <th></th>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Email Address</th>
                          <th>Weight</th>
                          <th>Uploaded</th>
                          <th>Plan</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {props.users.map((user, index) => (
                          <tr key={user.id}>
                            <td className="tablecheck">
                              <FormGroup check>
                                <Label check>
                                  <Input type="checkbox" />{' '}
                                  <span className="form-check-sign">
                                    <span className="check"></span>
                                  </span>
                                </Label>
                              </FormGroup>
                            </td>
                            <td className="thumbnail">
                              <figure className="tpf-list-img">
                                <img src={anime3} alt="..." />
                              </figure>
                            </td>
                            <td>TPF-{user.id}</td>
                            <td>{user.fullName}</td>
                            <td>{user.email}</td>
                            <td>pending from api kg</td>
                            <td className="text-center">
                              <Moment format="DD/MMM/YYYY">{user.createdAt}</Moment>
                            </td>
                            <td><Badge color="info" pill>Free pending from api</Badge></td>
                            <td className="text-right">
                              <Button className="btn-icon" color="info" size="sm" onClick={()=>{navigate('/admin/user/'+user.id)}}>
                                <VeiwIcon />
                              </Button>{` `}
                              <Button className="btn-icon" color="success" size="sm" onClick={()=>{
                                navigate('/admin/user/edit/'+user.id, { replace: true, state: {user} })
                              }}>
                                <EditIcon />
                              </Button>{` `}
                              <Button disabled={user.id === props.id ? true : false}className="btn-icon" color="warning" size="sm">
                                <DeleteIcon />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Pagination 
                      current_page={props.users_pagination.currentPage}
                      limit={props.users_pagination.limit}
                      previous={props.users_pagination.previousPage}
                      next={props.users_pagination.nextPage}
                      total_record={props.users_pagination.totalCount}
                      total_pages={props.users_pagination.totalPages}
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
  id: state.userReducer.id,
  users: state.usersReducer.users,
  total_users: state.usersReducer.total_users,
  users_pagination: state.usersReducer.users_pagination,
})

const mapDispatchToProps = (dispatch) => ({
  getUsersListAction: (data, navigate) => dispatch( getUsersListAction(data, navigate) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Users)