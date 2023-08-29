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
import { getFoodTypesListAction, FoodTypesDeleteAction } from "../../redux/actions/foodTypesAction";
import { connect } from "react-redux"
import Pagination from "../../components/Pagination/Pagination";
import EditIcon from "../../components/Icons/EditIcon";
import DeleteIcon from "../../components/Icons/DeleteIcon";
// import Moment from 'react-moment';
import { useNavigate } from "react-router-dom";

function FoodTypes (props) {
    const navigate = useNavigate()
    const [currentPageNumber, setcurrentPageNumber] = useState(1);
    useEffect(()=>{
      if(currentPageNumber) props.getFoodTypesListAction(currentPageNumber).then(response => {});
    },[currentPageNumber]);

    const deleteClickHandler = (id) => {
      props.FoodTypesDeleteAction(id).then(response => {
        if(response) props.getFoodTypesListAction(currentPageNumber);
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
                          Food Types
                          <Badge color="info" pill>{props.food_types_pagination.totalCount}</Badge>
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
                            <Link to="/admin/foodType/create">
                              <Button color="primary">
                                Create new Food Type
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
                          {/* <th>Slug</th> */}
                          {/* <th>Status</th> */}
                          {/* <th>UPLOADED</th> */}
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {props.food_types.map((food_types) => (
                          <tr key={food_types.id}>
                            <td>{food_types.id}</td>
                            <td>{food_types.title}</td>
                            {/* <td>{food_types.slug}</td>
                            <td>{food_types.status === true ? "ON": "OFF"}</td>
                            <td className="text-center">
                              <Moment format="DD/MMM/YYYY">{food_types.createdAt}</Moment>
                            </td> */}
                            <td className="text-right">
                              <Button className="btn-icon" color="success" size="sm" onClick={()=>{
                                navigate('/admin/foodType/edit/'+food_types.id, { replace: true, state: food_types })
                              }}>
                                <EditIcon />
                              </Button>{` `}
                              <Button className="btn-icon" color="warning" size="sm" onClick={()=>deleteClickHandler(food_types.id)}>
                                <DeleteIcon />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Pagination 
                      current_page={props.food_types_pagination.currentPage}
                      limit={props.food_types_pagination.limit}
                      previous={props.food_types_pagination.previousPage}
                      next={props.food_types_pagination.nextPage}
                      total_record={props.food_types_pagination.totalCount}
                      total_pages={props.food_types_pagination.totalPages}
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
  food_types: state.foodTypesReducer.food_types,
  food_types_pagination: state.foodTypesReducer.food_types_pagination,
})

const mapDispatchToProps = (dispatch) => ({
  getFoodTypesListAction: (data, navigate) => dispatch( getFoodTypesListAction(data, navigate) ),
  FoodTypesDeleteAction: (data, navigate) => dispatch( FoodTypesDeleteAction(data, navigate) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(FoodTypes)