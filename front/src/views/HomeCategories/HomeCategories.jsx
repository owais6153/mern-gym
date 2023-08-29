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
import { getHomeCategoriesListAction, homeCategoriesDeleteAction } from "../../redux/actions/homeCategoriesAction";
import { connect } from "react-redux"
import Pagination from "../../components/Pagination/Pagination";
import Moment from 'react-moment';
import { useNavigate } from "react-router-dom";
import anime3 from '../../assets/img/anime3.png';

function HomeCategories (props) {
    const navigate = useNavigate()
    const [currentPageNumber, setcurrentPageNumber] = useState(1);
    useEffect(()=>{
      if(currentPageNumber) props.getHomeCategoriesListAction(currentPageNumber).then(response => {});
    },[currentPageNumber]);

    const deleteClickHandler = (id) => {
      props.homeCategoriesDeleteAction(id).then(response => {
        if(response) props.getHomeCategoriesListAction(currentPageNumber);
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
                          Home Categories
                        </CardTitle>
                        <div className="selectDown">
                          <FormGroup>
                            <Label for="sortBy">Recent</Label>
                          </FormGroup>
                        </div>
                      </Col>
                      <Col>
                        <div className="filter">

                          <div className="addNew">
                            <Link to="/admin/homeCategories/create">
                              <Button color="primary">
                                Create new Category
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
                        {props.home_categories.map((home_categories) => (
                          <Col lg="6" key={home_categories.id}>
                              <div className="tpf-horizontal-card p-3 with-bg my-2">
                                  <Row>
                                      <Col md="2">
                                          <figure className="figImage">
                                              <img src={home_categories.image_url ? home_categories.image_url : anime3} alt="..."/>
                                          </figure>
                                      </Col>

                                      <Col lg="8" className="d-flex align-items-center pl-0">
                                          <div className="title">
                                              <h5 className="card-title font-weight-bold">{home_categories.title}</h5>
                                              <p>{home_categories.description}</p>
                                          </div>
                                      </Col>

                                      <Col lg="2" className="d-flex justify-content-end">
                                          <Button color="primary" className="tpf-btn mr-2" onClick={()=>{
                                              navigate('/admin/homeCategories/edit/'+home_categories.id, { replace: true, state: home_categories })
                                            }}>
                                              <i className="fa fa-pen"/>{" "}
                                          </Button>
                                          <Button color="warning" className="tpf-btn mr-2" onClick={()=>deleteClickHandler(home_categories.id)}>
                                              <i>
                                                <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M11.4293 0.902313H8.38241L8.1285 0.445282C8.02694 0.242157 7.79842 0.0898132 7.5953 0.0898132H4.67538C4.47225 0.0898132 4.21835 0.242157 4.14217 0.445282L3.91366 0.902313H0.866784C0.638268 0.902313 0.460534 1.10544 0.460534 1.30856V2.12106C0.460534 2.34958 0.638268 2.52731 0.866784 2.52731H11.4293C11.6324 2.52731 11.8355 2.34958 11.8355 2.12106V1.30856C11.8355 1.10544 11.6324 0.902313 11.4293 0.902313ZM1.80624 11.9472C1.83163 12.582 2.39022 13.0898 3.02499 13.0898H9.24569C9.88046 13.0898 10.439 12.582 10.4644 11.9472L11.023 3.33981H1.27303L1.80624 11.9472Z" fill="white"/>
                                                </svg>
                                              </i>
                                          </Button>
                                      </Col>
                                  </Row>
                              </div>
                          </Col>
                        ))}
                    </Row>
                      
                    <Pagination 
                      current_page={props.home_categories_pagination.currentPage}
                      limit={props.home_categories_pagination.limit}
                      previous={props.home_categories_pagination.previousPage}
                      next={props.home_categories_pagination.nextPage}
                      total_record={props.home_categories_pagination.totalCount}
                      total_pages={props.home_categories_pagination.totalPages}
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
  home_categories: state.homeCategoriesReducer.home_categories,
  home_categories_pagination: state.homeCategoriesReducer.home_categories_pagination,
})

const mapDispatchToProps = (dispatch) => ({
  getHomeCategoriesListAction: (data, navigate) => dispatch( getHomeCategoriesListAction(data, navigate) ),
  homeCategoriesDeleteAction: (data, navigate) => dispatch( homeCategoriesDeleteAction(data, navigate) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeCategories)