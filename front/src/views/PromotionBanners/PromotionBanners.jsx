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
    Label
} from "reactstrap";
import { getPromotionBannersListAction, PromotionBannersDeleteAction } from "../../redux/actions/promotionBannersAction";
import { connect } from "react-redux"
import Pagination from "../../components/Pagination/Pagination";
import { useNavigate } from "react-router-dom";

function PromotionBanners (props) {
    const navigate = useNavigate()
    const [currentPageNumber, setcurrentPageNumber] = useState(1);
    useEffect(()=>{
      if(currentPageNumber) props.getPromotionBannersListAction(currentPageNumber).then(response => {});
    },[currentPageNumber]);

    const deleteClickHandler = (id) => {
      props.PromotionBannersDeleteAction(id).then(response => {
        if(response) props.getPromotionBannersListAction(currentPageNumber);
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
                      <CardTitle tag="h4">Promotion Banners</CardTitle>
                      {/* <p className="category">Sort by:</p> */}
                      <div className="selectDown">
                        <FormGroup>
                          <Label for="sortBy">Recent</Label>
                        </FormGroup>
                      </div>
                    </Col>

                    <Col>
                      <div className="filter">
                        <div className="addNew">
                          <Link to="/admin/promotionBanners/create">
                              <Button color="primary">
                                  Update Banners
                                  <i className="fa fa-upload info"/>{" "}
                              </Button>
                          </Link>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>

                <CardBody>
                  <Row>
                    {props.promotion_banners.map((promotion_banner) => (
                      <Col lg="4">
                        <div className="Banner">
                          { promotion_banner.image_url ?
                            <figure className="banner-img" onClick={()=>{
                              navigate('/admin/promotionBanners/edit/'+promotion_banner.id, { replace: true, state: promotion_banner })
                            }}>
                              <img src={promotion_banner.image_url} alt="..." />
                            </figure>
                            :
                            <h4>Banner #{promotion_banner.id}</h4>
                          }
                        </div>
                      </Col>  
                    ))}
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* {props.promotion_banners.map((promotion_banners) => ( */}
          <Pagination 
            current_page={props.promotion_banners_pagination.currentPage}
            limit={props.promotion_banners_pagination.limit}
            previous={props.promotion_banners_pagination.previousPage}
            next={props.promotion_banners_pagination.nextPage}
            total_record={props.promotion_banners_pagination.totalCount}
            total_pages={props.promotion_banners_pagination.totalPages}
            setcurrentPageNumber={setcurrentPageNumber}
          />
        </>
    )
}

const mapStateToProps = state => ({
  promotion_banners: state.promotionBannersReducer.promotion_banners,
  promotion_banners_pagination: state.promotionBannersReducer.promotion_banners_pagination,
})

const mapDispatchToProps = (dispatch) => ({
  getPromotionBannersListAction: (data, navigate) => dispatch( getPromotionBannersListAction(data, navigate) ),
  PromotionBannersDeleteAction: (data, navigate) => dispatch( PromotionBannersDeleteAction(data, navigate) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(PromotionBanners)