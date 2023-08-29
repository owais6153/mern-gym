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
import { getMedicalInstructionsListAction, MedicalInstructionsDeleteAction } from "../../redux/actions/medicalInstructionsAction";
import { connect } from "react-redux"
import Pagination from "../../components/Pagination/Pagination";
import EditIcon from "../../components/Icons/EditIcon";
import DeleteIcon from "../../components/Icons/DeleteIcon";
// import Moment from 'react-moment';
import { useNavigate } from "react-router-dom";

function MedicalInstructions (props) {
    const navigate = useNavigate()
    const [currentPageNumber, setcurrentPageNumber] = useState(1);
    useEffect(()=>{
      if(currentPageNumber) props.getMedicalInstructionsListAction(currentPageNumber).then(response => {});
    },[currentPageNumber]);

    const deleteClickHandler = (id) => {
      props.MedicalInstructionsDeleteAction(id).then(response => {
        if(response) props.getMedicalInstructionsListAction(currentPageNumber);
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
                          Medical Instructions
                          <Badge color="info" pill>{props.medical_instructions_pagination.totalCount}</Badge>
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
                            <Link to="/admin/medicalInstruction/create">
                              <Button color="primary">
                                Create new Medical Instruction
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
                          <th>Medical Condition</th> 
                          <th>Status</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {props.medical_instructions.map((medical_instructions) => (
                          <tr key={medical_instructions.id}>
                            <td>{medical_instructions.id}</td>
                            <td>{medical_instructions.title}</td>
                            <td>{medical_instructions.medical_condition}</td>
                            <td>{medical_instructions.status === true ? "ON": "OFF"}</td>
                            <td className="text-right">
                              <Button className="btn-icon" color="success" size="sm" onClick={()=>{
                                navigate('/admin/medicalInstruction/edit/'+medical_instructions.id, { replace: true, state: medical_instructions })
                              }}>
                                <EditIcon />
                              </Button>{` `}
                              <Button className="btn-icon" color="warning" size="sm" onClick={()=>deleteClickHandler(medical_instructions.id)}>
                                <DeleteIcon />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Pagination 
                      current_page={props.medical_instructions_pagination.currentPage}
                      limit={props.medical_instructions_pagination.limit}
                      previous={props.medical_instructions_pagination.previousPage}
                      next={props.medical_instructions_pagination.nextPage}
                      total_record={props.medical_instructions_pagination.totalCount}
                      total_pages={props.medical_instructions_pagination.totalPages}
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
  medical_instructions: state.medicalInstructionsReducer.medical_instructions,
  medical_instructions_pagination: state.medicalInstructionsReducer.medical_instructions_pagination,
})

const mapDispatchToProps = (dispatch) => ({
  getMedicalInstructionsListAction: (data, navigate) => dispatch( getMedicalInstructionsListAction(data, navigate) ),
  MedicalInstructionsDeleteAction: (data, navigate) => dispatch( MedicalInstructionsDeleteAction(data, navigate) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(MedicalInstructions)