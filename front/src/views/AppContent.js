import React from "react";
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
    Pagination, PaginationItem, PaginationLink,
} from "reactstrap";
import anime3 from '../assets/img/anime3.png';
import ApplicationSettings from "./ApplicationSettings/ApplicationSettings";
import HelpfulTips from "./HelpfulTips/HelpfulTips";
import HomeCategories from "./HomeCategories/HomeCategories";
import PromotionBanners from "./PromotionBanners/PromotionBanners";
import Questions from "./Questions/Questions";

function AppContent () {
    return (
        <>
            <div className="content">
                <ApplicationSettings />
                <PromotionBanners />
                <HelpfulTips />
                <HomeCategories />

                <Row>
                    {/* <Col md="6">
                        <Card className="card-plain">
                            <CardHeader>
                                <div className="d-flex justify-content-between">
                                    <div className="heading">
                                        <h4 className="card-title mb-0">Getting Started Content</h4>
                                        <p>Recent</p>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardBody className="pt-0">
                                <div className="tpf-horizontal-card">
                                    <Row className="my-3">
                                        <Col md="2">
                                            <figure className="figImage">
                                                <img src={anime3} alt="..."/>
                                            </figure>
                                        </Col>

                                        <Col lg="10" className="d-flex align-items-center pl-0">
                                            <div className="title">
                                                <h5 className="card-title font-weight-bold">Getting Started Content</h5>
                                                <p>Text</p>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row className="my-3">
                                        <Col md="2">
                                            <figure className="figImage">
                                                <img src={anime3} alt="..."/>
                                            </figure>
                                        </Col>

                                        <Col lg="10" className="d-flex align-items-center pl-0">
                                            <div className="title">
                                                <h5 className="card-title font-weight-bold">Getting Started Content</h5>
                                                <p>Text</p>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row className="my-3">
                                        <Col md="2">
                                            <figure className="figImage">
                                                <img src={anime3} alt="..."/>
                                            </figure>
                                        </Col>

                                        <Col lg="10" className="d-flex align-items-center pl-0">
                                            <div className="title">
                                                <h5 className="card-title font-weight-bold">Getting Started Content</h5>
                                                <p>Text</p>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row className="my-3">
                                        <Col md="2">
                                            <figure className="figImage">
                                                <img src={anime3} alt="..."/>
                                            </figure>
                                        </Col>

                                        <Col lg="10" className="d-flex align-items-center pl-0">
                                            <div className="title">
                                                <h5 className="card-title font-weight-bold">Getting Started Content</h5>
                                                <p>Text</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>

                                <Button color="primary" className="btn-full" >
                                    EDIT
                                    <i className="fa fa-pen ml-2"/>{" "}
                                </Button>
                            </CardBody>
                        </Card>
                    </Col> */}

                    <Questions />
                  
                </Row>
            </div>
        </>
    )
}

export default AppContent   ;