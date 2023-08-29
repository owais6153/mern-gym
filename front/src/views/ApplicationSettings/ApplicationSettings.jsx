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
} from "reactstrap";
import { getApplicationSettingsListAction, ApplicationSettingsDeleteAction } from "../../redux/actions/applicationSettingsAction";
import { connect } from "react-redux"
import Pagination from "../../components/Pagination/Pagination";
import EditIcon from "../../components/Icons/EditIcon";
import DeleteIcon from "../../components/Icons/DeleteIcon";

import Moment from 'react-moment';
import { useNavigate } from "react-router-dom";

function ApplicationSettings (props) {
    const navigate = useNavigate()
    const [currentPageNumber, setcurrentPageNumber] = useState(1);
    useEffect(()=>{
      if(currentPageNumber) props.getApplicationSettingsListAction(currentPageNumber).then(response => {});
    },[currentPageNumber]);

    const deleteClickHandler = (id) => {
      props.ApplicationSettingsDeleteAction(id).then(response => {
        if(response) props.getApplicationSettingsListAction(currentPageNumber);
      });
    }
    return (
        <>
            <Row>
              <Col md="12">
                <Card className="card-plain tpf-card">
                  <CardHeader>
                    <Row>
                      <Col md="4" className="d-flex align-items-center">
                        <CardTitle tag="h4">Application Settings</CardTitle>
                      </Col>
                      <Col>
                        <div className="filter">

                          <div className="addNew">
                            <Link to="/admin/ApplicationSettings/create">
                              <Button color="primary">
                                Create new Settings
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
                          <th>Slug</th>
                          <th>Value</th>
                          <th>Status</th>
                          <th>UPLOADED</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {props.application_settings.map((application_settings) => (
                          <tr key={application_settings.id}>
                            <td>{application_settings.id}</td>
                            <td>{application_settings.title}</td>
                            <td>{application_settings.slug}</td>
                            <td>{application_settings.value}</td>
                            <td>{application_settings.status === true ? "ON": "OFF"}</td>
                            <td className="text-center">
                              <Moment format="DD/MMM/YYYY">{application_settings.createdAt}</Moment>
                            </td>
                            <td className="text-right">
                              <Button className="btn-icon" color="success" size="sm" onClick={()=>{
                                navigate('/admin/applicationSettings/edit/'+application_settings.id, { replace: true, state: application_settings })
                              }}>
                                <EditIcon />
                              </Button>{` `}
                              <Button className="btn-icon" color="warning" size="sm" onClick={()=>deleteClickHandler(application_settings.id)}>
                                <DeleteIcon />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Pagination 
                      current_page={props.application_settings_pagination.currentPage}
                      limit={props.application_settings_pagination.limit}
                      previous={props.application_settings_pagination.previousPage}
                      next={props.application_settings_pagination.nextPage}
                      total_record={props.application_settings_pagination.totalCount}
                      total_pages={props.application_settings_pagination.totalPages}
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
  application_settings: state.applicationSettingsReducer.application_settings,
  application_settings_pagination: state.applicationSettingsReducer.application_settings_pagination,
})

const mapDispatchToProps = (dispatch) => ({
  getApplicationSettingsListAction: (data, navigate) => dispatch( getApplicationSettingsListAction(data, navigate) ),
  ApplicationSettingsDeleteAction: (data, navigate) => dispatch( ApplicationSettingsDeleteAction(data, navigate) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationSettings)