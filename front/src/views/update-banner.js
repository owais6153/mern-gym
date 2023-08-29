import React from "react";
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
} from "reactstrap";
import anime3 from '../assets/img/anime3.png';

function UpdateBanner () {
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
                                                <h5 className="card-title font-weight-bold">Update Banners</h5>
                                                <ul className="breadCrumbList">
                                                    <li><a path="/admin/dashboard" >Home</a></li>
                                                    <li><a path="/admin/Users" >App Content</a></li>
                                                    <li><a path="/admin/Users" >Update Banners</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Col>

                                <Col xl="8">
                                    <div className="filter h-100 d-flex align-items-center justify-content-end">
                                        <div className="addNew">
                                            <Button color="default">
                                                discard
                                                <i className="fa fa-trash warning"/>{" "}
                                            </Button>

                                            <Button color="primary">
                                                Create new Recipe
                                                <i className="white">
                                                    <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M8.98584 14.4586C9.39209 14.4586 9.73584 14.1461 9.73584 13.7086V7.45863H12.9546C13.6421 7.45863 13.9546 6.67738 13.4858 6.17738L8.01709 0.677383C7.70459 0.396133 7.23584 0.396133 6.95459 0.677383L1.45459 6.17738C0.98584 6.67738 1.29834 7.45863 1.98584 7.45863H5.23584V13.7086C5.23584 14.1461 5.54834 14.4586 5.98584 14.4586H8.98584Z" fill="white"/>
                                                    </svg>
                                                </i>
                                            </Button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
						</div>
					</CardBody>
				</Card>

                <Card className="guide-card">
                    <CardBody>
                        <form>
                            <div className="form-row">
                                <FormGroup className="col-lg-12 ">
                                    <Label for="title">Banner #1</Label>
                                    <div className="tpfupload">
                                        <picture>
                                            <img src={anime3} alt="..."/>
                                        </picture>

                                        <Button color="warning" className="deleteBanner">
                                            <i className="fa fa-trash"></i>
                                        </Button>

                                        <div className="fileBg">
                                            <span className="icon">
                                                <svg width="94" height="94" viewBox="0 0 94 94" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect opacity="0.05" width="94" height="94" rx="47" fill="white"/>
                                                    <path d="M49.9951 53.9759C50.8063 53.9759 51.4926 53.3519 51.4926 52.4784V39.9989H57.9195C59.2923 39.9989 59.9163 38.439 58.9803 37.4406L48.0608 26.4587C47.4368 25.8971 46.5008 25.8971 45.9393 26.4587L34.9574 37.4406C34.0214 38.439 34.6454 39.9989 36.0181 39.9989H42.5074V52.4784C42.5074 53.3519 43.1314 53.9759 44.005 53.9759H49.9951Z" fill="#61A1F8"/>
                                                    <rect x="24.3706" y="57.3037" width="45.2588" height="7.32127" rx="2" fill="#61A1F8"/>
                                                </svg>
                                            </span>
                                            <Input className="form-control-file" type="file" name="uploadFile" id="uploadImg" />
                                        </div>

                                        <div className="titleUpload">
                                            <h4>Upload an Image</h4>
                                            <p>
                                                1920 x 1080 (16:9 Aspect Ratio)<br />
                                                Maximum Size: 5 mb
                                            </p>
                                        </div>
                                    </div>
                                </FormGroup>

                                <FormGroup className="col-lg-12 ">
                                    <Label for="title">Banner #2</Label>
                                    <div className="tpfupload">
                                        <div className="fileBg">
                                            <span className="icon">
                                                <svg width="94" height="94" viewBox="0 0 94 94" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect opacity="0.05" width="94" height="94" rx="47" fill="white"/>
                                                    <path d="M49.9951 53.9759C50.8063 53.9759 51.4926 53.3519 51.4926 52.4784V39.9989H57.9195C59.2923 39.9989 59.9163 38.439 58.9803 37.4406L48.0608 26.4587C47.4368 25.8971 46.5008 25.8971 45.9393 26.4587L34.9574 37.4406C34.0214 38.439 34.6454 39.9989 36.0181 39.9989H42.5074V52.4784C42.5074 53.3519 43.1314 53.9759 44.005 53.9759H49.9951Z" fill="#61A1F8"/>
                                                    <rect x="24.3706" y="57.3037" width="45.2588" height="7.32127" rx="2" fill="#61A1F8"/>
                                                </svg>
                                            </span>
                                            <Input className="form-control-file" type="file" name="uploadFile" id="uploadImg" />
                                        </div>

                                        <div className="titleUpload">
                                            <h4>Upload an Image</h4>
                                            <p>
                                                1920 x 1080 (16:9 Aspect Ratio)<br />
                                                Maximum Size: 5 mb
                                            </p>
                                        </div>
                                    </div>
                                </FormGroup>

                                <FormGroup className="col-lg-12 ">
                                    <Label for="title">Banner #3</Label>
                                    <div className="tpfupload">
                                        <div className="fileBg">
                                            <span className="icon">
                                                <svg width="94" height="94" viewBox="0 0 94 94" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect opacity="0.05" width="94" height="94" rx="47" fill="white"/>
                                                    <path d="M49.9951 53.9759C50.8063 53.9759 51.4926 53.3519 51.4926 52.4784V39.9989H57.9195C59.2923 39.9989 59.9163 38.439 58.9803 37.4406L48.0608 26.4587C47.4368 25.8971 46.5008 25.8971 45.9393 26.4587L34.9574 37.4406C34.0214 38.439 34.6454 39.9989 36.0181 39.9989H42.5074V52.4784C42.5074 53.3519 43.1314 53.9759 44.005 53.9759H49.9951Z" fill="#61A1F8"/>
                                                    <rect x="24.3706" y="57.3037" width="45.2588" height="7.32127" rx="2" fill="#61A1F8"/>
                                                </svg>
                                            </span>
                                            <Input className="form-control-file" type="file" name="uploadFile" id="uploadImg" />
                                        </div>

                                        <div className="titleUpload">
                                            <h4>Upload an Image</h4>
                                            <p>
                                                1920 x 1080 (16:9 Aspect Ratio)<br />
                                                Maximum Size: 5 mb
                                            </p>
                                        </div>
                                    </div>
                                </FormGroup>

                                <div className="col-lg-12">
                                    <div className="d-flex justify-content-end align-items-center w-100">
                                        <Button type="reset" color="default">
                                            discard
                                            <i className="fa fa-trash warning"/>{" "}
                                        </Button>

                                        <Button type="submit" color="primary">
                                            Create new Recipe
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

export default UpdateBanner;