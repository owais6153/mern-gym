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
import { PromotionBannersCreateAction } from "../../redux/actions/promotionBannersAction";
import { getHomeCategoriesListAction } from "../../redux/actions/homeCategoriesAction";
import { connect } from "react-redux"
import ImageUploder from "../../components/Uploders/ImageUploder";
import SaveAndPublish from "../../components/Buttons/SaveAndPublish";
import Discart from "../../components/Buttons/Discart";

function PromotionBannersCreate (props) {
    const navigate = useNavigate()
    const [error, setError] = useState({});
    const [HomeCategoriesLocal, setHomeCategoriesLocal] = useState([]);

    useEffect(()=>{
      if(props.errors) setError(props.errors);
    } , [props.errors])
    useEffect(()=>{
      // props.getHomeCategoriesListAction().then(response => {});
    } , [])
    useEffect(()=>{
      if(props.home_categories) setHomeCategoriesLocal(props.home_categories);
    } , [props.home_categories])

    const handleChange = (e) => {
      setError({})
    }
    const CreatePromotionBannersFormSubmitHandle = (e) => {
      e.preventDefault();
      let formData = new FormData(e.target);
      props.PromotionBannersCreateAction(formData, navigate).then(response => {});
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
                                              <h5 className="card-title font-weight-bold">New Promotion Banners</h5>
                                              <ul className="breadCrumbList">
                                                  <li><a path="/admin/dashboard" >Home</a></li>
                                                  <li><a path="/admin/Users" >App Content</a></li>
                                                  <li><a path="/admin/Users" >New Promotion Banners</a></li>
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
                        <form onSubmit={CreatePromotionBannersFormSubmitHandle} enctype="multipart/form-data">
                            <div className="form-row">
                                <input type="hidden" name="status" id="status" value="1" />

                                <FormGroup className="col-lg-6">
                                    <Label for="action_type">Action Type</Label>
                                    <Input type="select" name="action_type" id="action_type" onChange={handleChange} invalid={error.action_type ? true:false} > 
                                        <option disabled>Select</option>
                                        <option value="category">category</option>                                        
                                        {/* {HomeCategoriesLocal && HomeCategoriesLocal.map((home_categorie) => (
                                          <option key={home_categorie.id} value={home_categorie.title}>{home_categorie.title}</option>
                                        ))} */}
                                    </Input>
                                    { error && <FormFeedback>{error.action_type}</FormFeedback> }
                                </FormGroup>

                                <FormGroup className="col-lg-6">
                                    <Label for="action_id">Action Id</Label>
                                    <Input type="text" name="action_id" id="action_id" placeholder="Enter action_id"
                                          invalid={error.action_id ? true:false} required onChange={handleChange} 
                                        />
                                    { error && <FormFeedback>{error.action_id}</FormFeedback> }
                                </FormGroup>

                                <FormGroup className="col-lg-6">
                                    <Label for="display_order">Display Order</Label>
                                    <Input type="number" name="display_order" id="display_order" placeholder="Enter display_order"
                                          invalid={error.display_order ? true:false} required onChange={handleChange} 
                                        />
                                    { error && <FormFeedback>{error.display_order}</FormFeedback> }
                                </FormGroup>

                                <div className="col-lg-6">
                                    <h4 className="mt-3 mb-0">Status</h4>
                                    <FormGroup check inline className="form-check-radio">
                                        <Label className="form-check-label">
                                            <Input type="radio" name="status" onChange={handleChange} value={1} invalid={error.status ? true:false} defaultChecked />
                                            ON
                                            <span className="form-check-sign"></span>
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check inline className="form-check-radio">
                                        <Label className="form-check-label">
                                            <Input type="radio" name="status" onChange={handleChange} value={0} invalid={error.status ? true:false} />
                                            OFF
                                            <span className="form-check-sign"></span>
                                        </Label>
                                    </FormGroup>
                                    { error && <FormFeedback>{error.status}</FormFeedback> }
                                </div>
                                <ImageUploder field_name={"image"} error={error} />

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
  home_categories: state.homeCategoriesReducer.home_categories,
})

const mapDispatchToProps = (dispatch) => ({
  PromotionBannersCreateAction: (data, navigate) => dispatch( PromotionBannersCreateAction(data, navigate) ),
  getHomeCategoriesListAction: (data) => dispatch( getHomeCategoriesListAction(data) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(PromotionBannersCreate)