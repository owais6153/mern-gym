import React from "react";
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
} from "reactstrap";
import anime3 from '../assets/img/anime3.png';

function ChatSupport () {
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
                                            Chat Support
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
								</Row>
							</CardHeader>

							<CardBody>
                                <Row>
                                    <Col lg="3">
                                        <div className="SearchContact mb-2">
                                            <form>
                                                <Row>
                                                    <Col lg="9">
                                                        <Input type="text" placeholder="First name" />
                                                    </Col>
                                                    <Col lg="3">
                                                        <Button className="btn-link" color="white">
                                                            <i className="fa fa-search"></i>
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </form>
                                        </div>

                                        <div className="contactList">
                                            <ul>
                                                <li className="mb-2 active">
                                                    <div className="contact">
                                                        <figure>
                                                            <img src={anime3} alt="..."/>
                                                        </figure>

                                                        <div className="contactname">
                                                            <h4>
                                                                Bastian Schweinsteiger
                                                                <Badge color="primary">2</Badge>
                                                            </h4>
                                                            <p>12:49 PM - 26/Oct/2022</p>
                                                        </div>
                                                    </div>
                                                </li>

                                                <li className="mb-2 ">
                                                    <div className="contact">
                                                        <figure>
                                                            <img src={anime3} alt="..."/>
                                                        </figure>

                                                        <div className="contactname">
                                                            <h4>
                                                                Bastian Schweinsteiger
                                                                <Badge color="primary">2</Badge>
                                                            </h4>
                                                            <p>12:49 PM - 26/Oct/2022</p>
                                                        </div>
                                                    </div>
                                                </li>

<li className="mb-2 ">
    <div className="contact">
        <figure>
            <img src={anime3} alt="..."/>
        </figure>

        <div className="contactname">
            <h4>
                Bastian Schweinsteiger
                <Badge color="primary">2</Badge>
            </h4>
            <p>12:49 PM - 26/Oct/2022</p>
        </div>
    </div>
</li>

<li className="mb-2 ">
    <div className="contact">
        <figure>
            <img src={anime3} alt="..."/>
        </figure>

        <div className="contactname">
            <h4>
                Bastian Schweinsteiger
                <Badge color="primary">2</Badge>
            </h4>
            <p>12:49 PM - 26/Oct/2022</p>
        </div>
    </div>
</li>

<li className="mb-2 ">
    <div className="contact">
        <figure>
            <img src={anime3} alt="..."/>
        </figure>

        <div className="contactname">
            <h4>
                Bastian Schweinsteiger
                <Badge color="primary">2</Badge>
            </h4>
            <p>12:49 PM - 26/Oct/2022</p>
        </div>
    </div>
</li>

<li className="mb-2 ">
    <div className="contact">
        <figure>
            <img src={anime3} alt="..."/>
        </figure>

        <div className="contactname">
            <h4>
                Bastian Schweinsteiger
                <Badge color="primary">2</Badge>
            </h4>
            <p>12:49 PM - 26/Oct/2022</p>
        </div>
    </div>
</li>

<li className="mb-2 ">
    <div className="contact">
        <figure>
            <img src={anime3} alt="..."/>
        </figure>

        <div className="contactname">
            <h4>
                Bastian Schweinsteiger
                <Badge color="primary">2</Badge>
            </h4>
            <p>12:49 PM - 26/Oct/2022</p>
        </div>
    </div>
</li>

<li className="mb-2 ">
    <div className="contact">
        <figure>
            <img src={anime3} alt="..."/>
        </figure>

        <div className="contactname">
            <h4>
                Bastian Schweinsteiger
                <Badge color="primary">2</Badge>
            </h4>
            <p>12:49 PM - 26/Oct/2022</p>
        </div>
    </div>
</li>

<li className="mb-2 ">
    <div className="contact">
        <figure>
            <img src={anime3} alt="..."/>
        </figure>

        <div className="contactname">
            <h4>
                Bastian Schweinsteiger
                <Badge color="primary">2</Badge>
            </h4>
            <p>12:49 PM - 26/Oct/2022</p>
        </div>
    </div>
</li>

<li className="mb-2 ">
    <div className="contact">
        <figure>
            <img src={anime3} alt="..."/>
        </figure>

        <div className="contactname">
            <h4>
                Bastian Schweinsteiger
                <Badge color="primary">2</Badge>
            </h4>
            <p>12:49 PM - 26/Oct/2022</p>
        </div>
    </div>
</li>
                                            </ul>
                                        </div>
                                    </Col>

                                    <Col lg="9">
                                        <div className="chatWindow">
                                            <div className="cw-header">
                                                <figure>
                                                    <img src={anime3} alt="..."/>
                                                </figure>

                                                <Button className="btn-simple" color="primary">
                                                    <text className="white">View Profile</text>
                                                </Button>

                                                <div className="infoColumn d-flex flex-column">
                                                    <label className="text-center">Email</label>
                                                    <a href="mailto:Bastian.Schweinsteiger123@email.com" className="text-center" target="_blank">
                                                        Bastian.Schweinsteiger123@email.com
                                                    </a>
                                                </div>

                                                <div className="infoColumn d-flex flex-column">
                                                    <label className="text-center">Phone</label>
                                                    <a href="tel:+4256932997" className="text-center" target="_blank">
                                                    +4256932997
                                                    </a>
                                                </div>
                                            </div>

                                            <div className="cw-body">
                                                <div className="messageWindow">
                                                    <div className="messageTo d-flex justify-content-start">
                                                        <div className="messageBody">
                                                            <h4>
                                                                Bastian Schweinsteiger
                                                                <span className="time">1:15 pm</span>
                                                            </h4>
                                                            <div className="messageHere">
                                                                <p>
                                                                    Hey, I need help
                                                                </p> 
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="messageFrom d-flex justify-content-end">
                                                        <div className="messageBody justify-content-end d-flex flex-wrap">
                                                            <h4>
                                                                Bastian Schweinsteiger
                                                                <span className="time">1:15 pm</span>
                                                            </h4>
                                                            <div className="messageHere">
                                                                <p>
                                                                    Hey, I need help
                                                                </p> 
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="meeseageSend">
                                                    <form>
                                                        <Input type="text" placeholder="Type here" />
                                                        
                                                        <Button color="primary">
                                                            <i className="fa fa-paper-plane"></i>
                                                        </Button>
                                                    </form>
                                                </div>
                                            </div>

                                        </div>
                                    </Col>
                                </Row>
							</CardBody>
						</Card>
					</Col>
				</Row>
            </div>
        </>
    )
}

export default ChatSupport;