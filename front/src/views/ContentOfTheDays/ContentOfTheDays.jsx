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
import { getContentOfTheDaysListAction, ContentOfTheDaysDeleteAction } from "../../redux/actions/contentOfTheDaysAction";
import { connect } from "react-redux"
import Pagination from "../../components/Pagination/Pagination";
import EditIcon from "../../components/Icons/EditIcon";
import DeleteIcon from "../../components/Icons/DeleteIcon";
import Moment from 'react-moment';
import { useNavigate } from "react-router-dom";

function ContentOfTheDays (props) {
    const navigate = useNavigate()
    const [currentPageNumber, setcurrentPageNumber] = useState(1);
    useEffect(()=>{
      if(currentPageNumber) props.getContentOfTheDaysListAction(currentPageNumber).then(response => {});
    },[currentPageNumber]);

    const deleteClickHandler = (id) => {
      props.ContentOfTheDaysDeleteAction(id).then(response => {
        if(response) props.getContentOfTheDaysListAction(currentPageNumber);
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
                          Content Of The Days
                          <Badge color="info" pill>{props.content_of_the_days_pagination.totalCount}</Badge>
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
                            <Link to="/admin/contentOfTheDay/create">
                              <Button color="primary">
                                Create new Content Of The Days
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
                          <th>Visible Date</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {props.content_of_the_days.map((content_of_the_days) => (
                          <tr key={content_of_the_days.id}>
                            <td>{content_of_the_days.id}</td>
                            <td>{content_of_the_days.title}</td>
                            <td >
                              <Moment format="DD/MMM/YYYY hh:mm a">{content_of_the_days.visible_date}</Moment>
                            </td> 
                            <td className="text-right">
                              <Button className="btn-icon" color="success" size="sm" onClick={()=>{
                                navigate('/admin/contentOfTheDay/edit/'+content_of_the_days.id, { replace: true, state: content_of_the_days })
                              }}>
                                <EditIcon />
                              </Button>{` `}
                              <Button className="btn-icon" color="warning" size="sm" onClick={()=>deleteClickHandler(content_of_the_days.id)}>
                                <DeleteIcon />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Pagination 
                      current_page={props.content_of_the_days_pagination.currentPage}
                      limit={props.content_of_the_days_pagination.limit}
                      previous={props.content_of_the_days_pagination.previousPage}
                      next={props.content_of_the_days_pagination.nextPage}
                      total_record={props.content_of_the_days_pagination.totalCount}
                      total_pages={props.content_of_the_days_pagination.totalPages}
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
  content_of_the_days: state.contentOfTheDaysReducer.content_of_the_days,
  content_of_the_days_pagination: state.contentOfTheDaysReducer.content_of_the_days_pagination,
})

const mapDispatchToProps = (dispatch) => ({
  getContentOfTheDaysListAction: (data, navigate) => dispatch( getContentOfTheDaysListAction(data, navigate) ),
  ContentOfTheDaysDeleteAction: (data, navigate) => dispatch( ContentOfTheDaysDeleteAction(data, navigate) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ContentOfTheDays)