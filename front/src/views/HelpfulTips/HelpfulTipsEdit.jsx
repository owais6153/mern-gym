import React, {useState, useEffect} from "react";
import { Link } from 'react-router-dom';
import { useParams, useLocation } from 'react-router-dom';
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
import { helpFulTipsViewAction, helpFulTipsUpdateAction } from "../../redux/actions/helpfulTipsAction";
import { connect } from "react-redux"
import TextAreaEditor from "../../components/TextAreaEditor/TextAreaEditor";

function HelpfulTipsEdit (props) {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate()
    const [error, setError] = useState({});
    const [helpFulTips, helpFulTipsData] = useState({
      id:(location.state?location.state.id:0),
      title:(location.state?location.state.title:""),
      description:(location.state?location.state.description:""),
      type:(location.state?location.state.type:""),
      start_date:moment().add(5, 'minutes'),
      end_date:moment().add(10, 'minutes'),
      status:1,
    });

    useEffect(()=>{
      if(props.errors) setError(props.errors);
    } , [props.errors])
    useEffect(()=>{
      props.helpFulTipsViewAction(id).then(response => {});
    } , [])
    useEffect(()=>{
      if(props.helpful_tip) {
        helpFulTipsData((currentState) => ({
          ...currentState,
          ...props.helpful_tip,
        }));
      }
    } , [props.helpful_tip])

    const handleChange = (e) => {
      helpFulTipsData((currentState) => ({
        ...currentState,
        [e.target.name]: e.target.value
      }));
      setError({})
    }

    const CreateHelpFulTipsFormSubmitHandle = (e) => {
      e.preventDefault();
      props.helpFulTipsUpdateAction(helpFulTips, navigate).then(response => {});
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
                                              <h5 className="card-title font-weight-bold">Edit Helpful Tips</h5>
                                              <ul className="breadCrumbList">
                                                  <li><a path="/admin/dashboard" >Home</a></li>
                                                  <li><a path="/admin/Users" >App Content</a></li>
                                                  <li><a path="/admin/Users" >Edit Helpful Tips</a></li>
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
                                    <Input type="select" name="type" id="type" onChange={handleChange} 
                                      invalid={error.type ? true:false}
                                      value={helpFulTips.type} 
                                    >
                                        <option disabled>Select</option>
                                        <option value="general">General</option>
                                        <option value="medical_condition">Medical condition</option>
                                    </Input>
                                    { error && <FormFeedback>{error.type}</FormFeedback> }
                                </FormGroup>
                                <TextAreaEditor value={helpFulTips.description} error={error} />
                                <div className="col-lg-12">
                                    <div className="d-flex justify-content-end align-items-center w-100">
                                        <Button type="reset" color="default">
                                            discard
                                            <i className="fa fa-trash warning"/>{" "}
                                        </Button>

                                        <Button type="submit" color="primary">
                                            Save & Publish
                                            <i className="white">
                                                <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8.98584 14.4586C9.39209 14.4586 9.73584 14.1461 9.73584 13.7086V7.45863H12.9546C13.6421 7.45863 13.9546 6.67738 13.4858 6.17738L8.01709 0.677383C7.70459 0.396133 7.23584 0.396133 6.95459 0.677383L1.45459 6.17738C0.98584 6.67738 1.29834 7.45863 1.98584 7.45863H5.23584V13.7086C5.23584 14.1461 5.54834 14.4586 5.98584 14.4586H8.98584Z" fill="white"/>
                                                </svg>
                                            </i>
                                        </Button>
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
  helpful_tip: state.helpfulTipsReducer.helpful_tip,
})

const mapDispatchToProps = (dispatch) => ({
  helpFulTipsUpdateAction: (data, navigate) => dispatch( helpFulTipsUpdateAction(data, navigate) ),
  helpFulTipsViewAction: (data) => dispatch( helpFulTipsViewAction(data) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(HelpfulTipsEdit)