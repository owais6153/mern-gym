import React, {useState, useEffect} from "react";
import { Link } from 'react-router-dom';
import { 
    Card, 
    CardBody, 
    Row, 
    Col,
    Button,
    FormGroup,
    Label,
    Input,
    FormFeedback,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { QuestionsCreateAction } from "../../redux/actions/questionsAction";
import { getEntitiesListAction, getAttributesFromEntitieNameAction } from "../../redux/actions/entityAndAttributesAction";
import { connect } from "react-redux"
import SaveAndPublish from "../../components/Buttons/SaveAndPublish";
import Discart from "../../components/Buttons/Discart";

function QuestionsCreate (props) {
    const [answerInputList, setAnswerInputList] = useState([{ answer: "" }]);

    // handle input change
    const handleInputChange = (e, index) => {
      const { name, value } = e.target;
      const list = [...answerInputList];
      list[index][name] = value;
      setAnswerInputList(list);
    };
  
    // handle click event of the Remove button
    const handleRemoveClick = index => {
      const list = [...answerInputList];
      list.splice(index, 1);
      setAnswerInputList(list);
    };
  
    // handle click event of the Add button
    const handleAddClick = () => {
      setAnswerInputList([...answerInputList, { answer: "" }]);
    };
  
    const navigate = useNavigate()
    const [error, setError] = useState({});
    useEffect(()=>{
      props.getEntitiesListAction().then(response => {});
    } , [])
    useEffect(()=>{
      if(props.errors) setError(props.errors);
    } , [props.errors])
    const handleChange = (e) => {
      setError({})
    }
    const CreateQuestionsFormSubmitHandle = (e) => {
      e.preventDefault();
      let formData = new FormData(e.target);
      props.QuestionsCreateAction(formData, navigate).then(response => {});
    }

    const entityChangeHandler = (e) => {
      console.log(e.target.value);
      if(e.target.value) props.getAttributesFromEntitieNameAction(e.target.value).then(response => {});
    }
    
    return (
        <>
            <div className="content">
                <Card className="breadCrumb">
                    <CardBody>
                      <div className="tpf-horizontal-card">
                          <Row>
                              <Col xl="4">
                                  <div className="d-flex">
                                      <div>
                                          <Link to="/admin/app-content">
                                          <figure className="figImage d-flex align-items-center">
                                              <svg width="50" height="50" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                  <circle opacity="0.2" cx="18" cy="18" r="18" fill="#4F76D9"/>
                                                  <path d="M13.6475 16.758C13.3486 17.0568 13.3486 17.5549 13.6475 17.8537L20.0889 24.3283C20.4209 24.6271 20.9189 24.6271 21.2178 24.3283L21.9814 23.5646C22.2803 23.2658 22.2803 22.7678 21.9814 22.4357L16.8682 17.2892L21.9814 12.176C22.2803 11.8439 22.2803 11.3459 21.9814 11.0471L21.2178 10.2834C20.9189 9.98456 20.4209 9.98456 20.0889 10.2834L13.6475 16.758Z" fill="white"/>
                                              </svg>
                                          </figure>
                                          </Link>
                                      </div>

                                      <div className="pl-3 flex-shrink-1 w-100 d-flex align-items-center">
                                          <div className="title">
                                              <h5 className="card-title font-weight-bold">New Questions</h5>
                                              <ul className="breadCrumbList">
                                                  <li><a path="/admin/dashboard" >Home</a></li>
                                                  <li><a path="/admin/Users" >App Content</a></li>
                                                  <li><a path="/admin/Users" >New Questions</a></li>
                                              </ul>
                                          </div>
                                      </div>
                                  </div>
                              </Col>

                              
                          </Row>
                      </div>
                    </CardBody>
                </Card>

                <Card className="guide-card">
                    <CardBody>
                        <form onSubmit={CreateQuestionsFormSubmitHandle} enctype="multipart/form-data">
                            <div className="form-row">
                                <input type="hidden" name="status" id="status" value="1" />

                                <FormGroup className="col-lg-6">
                                    <Label for="title">Title</Label>
                                    <Input type="text" name="title" id="title" placeholder="Enter title"
                                          invalid={error.title ? true:false} onChange={handleChange} 
                                        />
                                    { error && <FormFeedback>{error.title}</FormFeedback> }
                                </FormGroup>
                                
                                <FormGroup className="col-lg-6">
                                    <Label for="entity">Entity</Label>
                                    <Input type="select" name="entity" id="entity" onChange={(e) => {handleChange(e); entityChangeHandler(e)}} invalid={error.entity ? true:false} >
                                        <option disabled>Select</option>
                                        {props.entities && props.entities.map((entitie,index)=><option value={entitie} key={index}>{entitie}</option>)}
                                    </Input>
                                    { error && <FormFeedback>{error.entity}</FormFeedback> }
                                </FormGroup>

                                <FormGroup className="col-lg-6">
                                    <Label for="attribute">Attribute</Label>
                                    <Input type="select" name="attribute" id="attribute" onChange={handleChange} invalid={error.attribute ? true:false} >
                                        <option disabled>Select</option>
                                        {props.attributes && props.attributes.map((entitie,index)=><option value={entitie} key={index}>{entitie}</option>)}
                                    </Input>
                                    { error && <FormFeedback>{error.attribute}</FormFeedback> }
                                </FormGroup>

                                <FormGroup className="col-lg-6">
                                    <Label for="data_type">Data type</Label>
                                    <Input type="select" name="data_type" id="data_type" onChange={handleChange} invalid={error.data_type ? true:false} >
                                        <option disabled>Select</option>
                                        <option value="alphabet">Alphabet</option>
                                        <option value="decimal">Decimal</option>
                                        <option value="number">Number</option>
                                    </Input>
                                    { error && <FormFeedback>{error.data_type}</FormFeedback> }
                                </FormGroup>

                                <div className="col-lg-6 d-flex flex-column justify-content-center">
                                    <h4 className="mt-3 mb-0">Is Mcq</h4>
                                    <FormGroup check className="mt-0">
                                        <Label className="form-check-label mr-4">
                                            <Input className="form-check-input" type="radio" name="is_mcq" onChange={handleChange} value={1} checked invalid={error.is_mcq ? true:false} />
                                            ON
                                            <span className="form-check-sign">
                                            <span className="check"></span>
                                            </span>
                                        </Label>

                                        <Label className="form-check-label ">
                                            <Input className="form-check-input" type="radio" name="is_mcq" onChange={handleChange} value={0} invalid={error.is_mcq ? true:false}  />
                                            OFF
                                            <span className="form-check-sign">
                                            <span className="check"></span>
                                            </span>
                                        </Label>
                                    </FormGroup>
                                    { error && <FormFeedback>{error.is_mcq}</FormFeedback> }
                                </div>

                                <div className="col-lg-6 d-flex flex-column justify-content-center">
                                    <h4 className="mt-3 mb-0">Is required</h4>
                                    <FormGroup check className="mt-0">
                                        <Label className="form-check-label mr-4">
                                            <Input className="form-check-input" type="radio" name="is_required" onChange={handleChange} value={1} checked invalid={error.is_required ? true:false} />
                                            ON
                                            <span className="form-check-sign">
                                            <span className="check"></span>
                                            </span>
                                        </Label>

                                        <Label className="form-check-label ">
                                            <Input className="form-check-input" type="radio" name="is_required" onChange={handleChange} value={0} invalid={error.is_required ? true:false}  />
                                            OFF
                                            <span className="form-check-sign">
                                            <span className="check"></span>
                                            </span>
                                        </Label>
                                    </FormGroup>
                                    { error && <FormFeedback>{error.is_required}</FormFeedback> }
                                </div>

                                <div className="col-lg-6 d-flex flex-column justify-content-center">
                                    <h4 className="mt-3 mb-0">Status</h4>
                                    <FormGroup check className="mt-0">
                                        <Label className="form-check-label mr-4">
                                            <Input className="form-check-input" type="radio" name="status" onChange={handleChange} value={1} checked invalid={error.status ? true:false} />
                                            ON
                                            <span className="form-check-sign">
                                            <span className="check"></span>
                                            </span>
                                        </Label>

                                        <Label className="form-check-label ">
                                            <Input className="form-check-input" type="radio" name="status" onChange={handleChange} value={0} invalid={error.status ? true:false}  />
                                            OFF
                                            <span className="form-check-sign">
                                            <span className="check"></span>
                                            </span>
                                        </Label>
                                    </FormGroup>
                                    { error && <FormFeedback>{error.status}</FormFeedback> }
                                </div>

                                <FormGroup className="col-lg-6">
                                    <Label for="data_type">Answers</Label>
                                    {answerInputList.map((x, i) => {
                                      return (
                                        <div className="box">
                                          <Input name="answer" placeholder="Enter answer" value={x.answer} onChange={e => handleInputChange(e, i)}
                                          />
                                          <div className="btn-box">
                                            {answerInputList.length !== 1 && <Button color="danger" onClick={() => handleRemoveClick(i)}>Remove</Button>}
                                              {answerInputList.length - 1 === i && <Button color="success" onClick={handleAddClick}>Add</Button>}
                                          </div>
                                        </div>
                                      );
                                    })}
                                </FormGroup>

                                <div className="col-lg-12">
                                    <div className="d-flex justify-content-end align-items-center w-100">
                                        <Discart status_field={true} back="app-content" />
                                        <SaveAndPublish status_field={true} />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
  errors: state.commonReducer.errors,
  entities: state.entityAndAttributesReducer.entities,
  attributes: state.entityAndAttributesReducer.attributes,
})

const mapDispatchToProps = (dispatch) => ({
  QuestionsCreateAction: (data, navigate) => dispatch( QuestionsCreateAction(data, navigate) ),
  getEntitiesListAction: () => dispatch( getEntitiesListAction() ),
  getAttributesFromEntitieNameAction: (data) => dispatch( getAttributesFromEntitieNameAction(data) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(QuestionsCreate)