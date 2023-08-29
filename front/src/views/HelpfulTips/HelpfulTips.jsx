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
import { getHelpFulTipsListAction, helpFulTipsDeleteAction } from "../../redux/actions/helpfulTipsAction";
import { connect } from "react-redux"
import Pagination from "../../components/Pagination/Pagination";
import Moment from 'react-moment';
import { useNavigate } from "react-router-dom";

function HelpfulTips (props) {
    const navigate = useNavigate()
    const [currentPageNumber, setcurrentPageNumber] = useState(1);
    useEffect(()=>{
      if(currentPageNumber) props.getHelpFulTipsListAction(currentPageNumber).then(response => {});
    },[currentPageNumber]);

    const deleteClickHandler = (id) => {
      props.helpFulTipsDeleteAction(id).then(response => {
        if(response) props.getHelpFulTipsListAction(currentPageNumber);
      });
    }
    return (
        <>
            <Row>
              <Col md="12">
                <Card className="card-plain tpf-card">
                  <CardHeader>
                    <Row>
                      <Col md="4">
                        <CardTitle tag="h4">
                          Helpful Tips
                          <Badge color="info" pill>{props.helpful_tips_pagination.totalCount}</Badge>
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
                            <Link to="/admin/helpfulTips/create">
                              <Button color="primary">
                                Create new Tip
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
                          <th>Title</th>
                          <th>Audience</th>
                          <th>Description</th>
                          <th>Created</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {props.helpful_tips.map((helpful_tips) => (
                          <tr key={helpful_tips.id}>
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
                            <td>{helpful_tips.title}</td>
                            <td>{helpful_tips.type}</td>
                            <td>{helpful_tips.description}</td>
                            <td>
                              <Moment format="h:s A - DD/MMM/YYYY">{helpful_tips.createdAt}</Moment>
                            </td>
                            
                            <td className="text-right">
                              <Button className="btn-icon" color="info" size="sm" onClick={()=>{
                                navigate('/admin/helpfulTips/edit/'+helpful_tips.id, { replace: true, state: helpful_tips })
                              }}>
                                <i>
                                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.9504 2.66666L0.891808 9.72525L0.587121 12.6198C0.536339 13.0006 0.866417 13.3307 1.24728 13.2799L4.14181 12.9753L11.2004 5.91666L7.9504 2.66666ZM13.2063 2.18423L11.6828 0.660797C11.2258 0.178375 10.4387 0.178375 9.95626 0.660797L8.53439 2.08267L11.7844 5.33267L13.2063 3.9108C13.6887 3.42838 13.6887 2.64127 13.2063 2.18423Z" fill="white"/>
                                  </svg>
                                </i>
                              </Button>{` `}
                              <Button className="btn-icon" color="warning" size="sm" onClick={()=>deleteClickHandler(helpful_tips.id)} >
                                <i>
                                  <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.4293 0.902313H8.38241L8.1285 0.445282C8.02694 0.242157 7.79842 0.0898132 7.5953 0.0898132H4.67538C4.47225 0.0898132 4.21835 0.242157 4.14217 0.445282L3.91366 0.902313H0.866784C0.638268 0.902313 0.460534 1.10544 0.460534 1.30856V2.12106C0.460534 2.34958 0.638268 2.52731 0.866784 2.52731H11.4293C11.6324 2.52731 11.8355 2.34958 11.8355 2.12106V1.30856C11.8355 1.10544 11.6324 0.902313 11.4293 0.902313ZM1.80624 11.9472C1.83163 12.582 2.39022 13.0898 3.02499 13.0898H9.24569C9.88046 13.0898 10.439 12.582 10.4644 11.9472L11.023 3.33981H1.27303L1.80624 11.9472Z" fill="white"/>
                                  </svg>
                                </i>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Pagination 
                      current_page={props.helpful_tips_pagination.currentPage}
                      limit={props.helpful_tips_pagination.limit}
                      previous={props.helpful_tips_pagination.previousPage}
                      next={props.helpful_tips_pagination.nextPage}
                      total_record={props.helpful_tips_pagination.totalCount}
                      total_pages={props.helpful_tips_pagination.totalPages}
                      setcurrentPageNumber={setcurrentPageNumber}
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
        </>
    )
}

const mapStateToProps = state => ({
  helpful_tips: state.helpfulTipsReducer.helpful_tips,
  helpful_tips_pagination: state.helpfulTipsReducer.helpful_tips_pagination,
})

const mapDispatchToProps = (dispatch) => ({
  getHelpFulTipsListAction: (data, navigate) => dispatch( getHelpFulTipsListAction(data, navigate) ),
  helpFulTipsDeleteAction: (data, navigate) => dispatch( helpFulTipsDeleteAction(data, navigate) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(HelpfulTips)