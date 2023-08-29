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
import moment from 'moment';
import { useNavigate } from "react-router-dom";
import { helpFulTipsCreateAction } from "../../redux/actions/helpfulTipsAction";
import { connect } from "react-redux"
import TextAreaEditor from "../../components/TextAreaEditor/TextAreaEditor";
import SaveAndPublish from "../../components/Buttons/SaveAndPublish";
import Discart from "../../components/Buttons/Discart";

function HelpfulTipsCreate (props) {
    const navigate = useNavigate()

    const [error, setError] = useState({});
    const [helpFulTips, helpFulTipsData] = useState({
      title:"",
      description:"",
      type:"",
      start_date:moment().add(5, 'minutes'),
      end_date:moment().add(10, 'minutes'),
      status:1,
    });

    useEffect(()=>{
      if(props.errors) setError(props.errors);
    } , [props.errors])

    const handleChange = (e) => {
      helpFulTipsData((currentState) => ({
        ...currentState,
        [e.target.name]: e.target.value
      }));
      setError({})
    }
    const CreateHelpFulTipsFormSubmitHandle = (e) => {
      e.preventDefault();
      props.helpFulTipsCreateAction(helpFulTips, navigate).then(response => {});
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
                                              <h5 className="card-title font-weight-bold">New Tips</h5>
                                              <ul className="breadCrumbList">
                                                  <li><a path="/admin/dashboard" >Home</a></li>
                                                  <li><a path="/admin/Users" >App Content</a></li>
                                                  <li><a path="/admin/Users" >New Tips</a></li>
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
                        <form onSubmit={CreateHelpFulTipsFormSubmitHandle}>
                            <div className="form-row">
                                <FormGroup className="col-lg-6">
                                    <Label for="title">Title</Label>
                                    <Input type="text" name="title" id="title" placeholder="Enter title"
                                          value={helpFulTips.title} onChange={handleChange} 
                                          invalid={error.title ? true:false}
                                        />
                                    { error && <FormFeedback>{error.title}</FormFeedback> }
                                </FormGroup>

                                <FormGroup className="col-lg-6">
                                    <Label for="category">Audience</Label>
                                    <Input type="select" name="type" id="type" onChange={handleChange} invalid={error.type ? true:false} >
                                        <option disabled>Select</option>
                                        <option value="general">General</option>
                                        <option value="medical_condition">Medical condition</option>
                                    </Input>
                                    { error && <FormFeedback>{error.type}</FormFeedback> }
                                </FormGroup>

                                <TextAreaEditor error={error} />

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
})

const mapDispatchToProps = (dispatch) => ({
  helpFulTipsCreateAction: (data, navigate) => dispatch( helpFulTipsCreateAction(data, navigate) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(HelpfulTipsCreate)