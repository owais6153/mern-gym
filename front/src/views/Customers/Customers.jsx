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
import { getCustomersListAction, CustomersDeleteAction } from "../../redux/actions/customersAction";
import { connect } from "react-redux"
import Pagination from "../../components/Pagination/Pagination";
import Moment from 'react-moment';
import { useNavigate } from "react-router-dom";
import ViewIcon from "../../components/Icons/ViewIcon";
import EditIcon from "../../components/Icons/EditIcon";
import DeleteIcon from "../../components/Icons/DeleteIcon";

function Customers (props) {
    const navigate = useNavigate()
    const [currentPageNumber, setcurrentPageNumber] = useState(1);
    useEffect(()=>{
      if(currentPageNumber) props.getCustomersListAction(currentPageNumber).then(response => {});
    },[currentPageNumber]);

    const deleteClickHandler = (id) => {
      props.CustomersDeleteAction(id, navigate).then(response => {
        if(response) props.getCustomersListAction(currentPageNumber);
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
                          Customers
                          <Badge color="info" pill>{props.customers_pagination.totalCount}</Badge>
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
                            <Link to="/admin/customer/create">
                              <Button color="primary">
                                Create new Customers
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
                        {props.customers.map((customer, index) => (
                          <tr key={customer.id}>
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
                            <td>TPF-{customer.id}</td>
                            <td>{customer.fullName}</td>
                            <td>{customer.email}</td>
                            <td>{customer.weight?customer.weight+" kg":0}</td>
                            <td className="text-center">
                              <Moment format="DD/MMM/YYYY">{customer.createdAt}</Moment>
                            </td>
                            <td><Badge color="info" pill>Free pending from api</Badge></td>
                            <td className="text-right">
                              <Button className="btn-icon" color="info" size="sm" onClick={()=>{navigate('/admin/customer/'+customer.id)}}>
                                <ViewIcon />
                              </Button>{` `}
                              <Button className="btn-icon" color="success" size="sm" onClick={()=>{
                                navigate('/admin/customer/edit/'+customer.id, { replace: true, state: {customer} })
                              }}>
                                <EditIcon />
                              </Button>{` `}
                              <Button className="btn-icon" color="warning" size="sm" onClick={()=>deleteClickHandler(customer.id)}>
                                <DeleteIcon />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Pagination 
                      current_page={props.customers_pagination.currentPage}
                      limit={props.customers_pagination.limit}
                      previous={props.customers_pagination.previousPage}
                      next={props.customers_pagination.nextPage}
                      total_record={props.customers_pagination.totalCount}
                      total_pages={props.customers_pagination.totalPages}
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
  customers: state.customersReducer.customers,
  customers_pagination: state.customersReducer.customers_pagination,
})

const mapDispatchToProps = (dispatch) => ({
  getCustomersListAction: (data, navigate) => dispatch( getCustomersListAction(data, navigate) ),
  CustomersDeleteAction: (data, navigate) => dispatch( CustomersDeleteAction(data, navigate) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Customers)