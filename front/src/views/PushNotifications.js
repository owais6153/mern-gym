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

function PushNotifications () {
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
                                            Notifications
											<Badge color="info" pill>4,150</Badge>
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
											<div className="addNew">
												<Link to="/admin/new-notification">
													<Button color="primary">
														Create new Notification
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
											<th className="tablecheck">
												<FormGroup check>
													<Label check>
														<Input type="checkbox" />{' '}
														<span className="form-check-sign">
															<span className="check"></span>
														</span>
													</Label>
												</FormGroup>
											</th>
											<th>Title</th>
											<th>Sent to</th>
											<th>Opened by</th>
											<th>Conversion</th>
											<th>Sent</th>
											<th className="text-right">Actions</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td className="tablecheck">
												<FormGroup check>
													<Label check>
														<Input type="checkbox" />{' '}
														<span className="form-check-sign">
															<span className="check"></span>
														</span>
													</Label>
												</FormGroup>
											</td>
											<td>TUESDAY 221018 This triplet</td>
											<td>35,980</td>
											<td>1,560</td>
											<td>30%</td>
											<td>12:49 PM - 26/Oct/2022</td>
											<td className="text-right">
                                                <Button color="info" size="sm">
                                                    RESEND
												</Button>
											</td>
										</tr>

										<tr>
											<td className="tablecheck">
												<FormGroup check>
													<Label check>
														<Input type="checkbox" />{' '}
														<span className="form-check-sign">
															<span className="check"></span>
														</span>
													</Label>
												</FormGroup>
											</td>
											<td>TUESDAY 221018 This triplet</td>
											<td>35,980</td>
											<td>1,560</td>
											<td>30%</td>
											<td>12:49 PM - 26/Oct/2022</td>
											<td className="text-right">
                                                <Button color="info" size="sm">
                                                    RESEND
												</Button>
											</td>
										</tr>

										<tr>
											<td className="tablecheck">
												<FormGroup check>
													<Label check>
														<Input type="checkbox" />{' '}
														<span className="form-check-sign">
															<span className="check"></span>
														</span>
													</Label>
												</FormGroup>
											</td>
											<td>TUESDAY 221018 This triplet</td>
											<td>35,980</td>
											<td>1,560</td>
											<td>30%</td>
											<td>12:49 PM - 26/Oct/2022</td>
											<td className="text-right">
                                                <Button color="info" size="sm">
                                                    RESEND
												</Button>
											</td>
										</tr>

										<tr>
											<td className="tablecheck">
												<FormGroup check>
													<Label check>
														<Input type="checkbox" />{' '}
														<span className="form-check-sign">
															<span className="check"></span>
														</span>
													</Label>
												</FormGroup>
											</td>
											<td>TUESDAY 221018 This triplet</td>
											<td>35,980</td>
											<td>1,560</td>
											<td>30%</td>
											<td>12:49 PM - 26/Oct/2022</td>
											<td className="text-right">
                                                <Button color="info" size="sm">
                                                    RESEND
												</Button>
											</td>
										</tr>

										<tr>
											<td className="tablecheck">
												<FormGroup check>
													<Label check>
														<Input type="checkbox" />{' '}
														<span className="form-check-sign">
															<span className="check"></span>
														</span>
													</Label>
												</FormGroup>
											</td>
											<td>TUESDAY 221018 This triplet</td>
											<td>35,980</td>
											<td>1,560</td>
											<td>30%</td>
											<td>12:49 PM - 26/Oct/2022</td>
											<td className="text-right">
                                                <Button color="info" size="sm">
                                                    RESEND
												</Button>
											</td>
										</tr>

										<tr>
											<td className="tablecheck">
												<FormGroup check>
													<Label check>
														<Input type="checkbox" />{' '}
														<span className="form-check-sign">
															<span className="check"></span>
														</span>
													</Label>
												</FormGroup>
											</td>
											<td>TUESDAY 221018 This triplet</td>
											<td>35,980</td>
											<td>1,560</td>
											<td>30%</td>
											<td>12:49 PM - 26/Oct/2022</td>
											<td className="text-right">
                                                <Button color="info" size="sm">
                                                    RESEND
												</Button>
											</td>
										</tr>

										<tr>
											<td className="tablecheck">
												<FormGroup check>
													<Label check>
														<Input type="checkbox" />{' '}
														<span className="form-check-sign">
															<span className="check"></span>
														</span>
													</Label>
												</FormGroup>
											</td>
											<td>TUESDAY 221018 This triplet</td>
											<td>35,980</td>
											<td>1,560</td>
											<td>30%</td>
											<td>12:49 PM - 26/Oct/2022</td>
											<td className="text-right">
                                                <Button color="info" size="sm">
                                                    RESEND
												</Button>
											</td>
										</tr>

										<tr>
											<td className="tablecheck">
												<FormGroup check>
													<Label check>
														<Input type="checkbox" />{' '}
														<span className="form-check-sign">
															<span className="check"></span>
														</span>
													</Label>
												</FormGroup>
											</td>
											<td>TUESDAY 221018 This triplet</td>
											<td>35,980</td>
											<td>1,560</td>
											<td>30%</td>
											<td>12:49 PM - 26/Oct/2022</td>
											<td className="text-right">
                                                <Button color="info" size="sm">
                                                    RESEND
												</Button>
											</td>
										</tr>

										<tr>
											<td className="tablecheck">
												<FormGroup check>
													<Label check>
														<Input type="checkbox" />{' '}
														<span className="form-check-sign">
															<span className="check"></span>
														</span>
													</Label>
												</FormGroup>
											</td>
											<td>TUESDAY 221018 This triplet</td>
											<td>35,980</td>
											<td>1,560</td>
											<td>30%</td>
											<td>12:49 PM - 26/Oct/2022</td>
											<td className="text-right">
                                                <Button color="info" size="sm">
                                                RESEND
												</Button>
											</td>
										</tr>

										<tr>
											<td className="tablecheck">
												<FormGroup check>
													<Label check>
														<Input type="checkbox" />{' '}
														<span className="form-check-sign">
															<span className="check"></span>
														</span>
													</Label>
												</FormGroup>
											</td>
											<td>TUESDAY 221018 This triplet</td>
											<td>35,980</td>
											<td>1,560</td>
											<td>30%</td>
											<td>12:49 PM - 26/Oct/2022</td>
											<td className="text-right">
                                                <Button color="info" size="sm">
                                                RESEND
												</Button>
											</td>
										</tr>

										<tr>
											<td className="tablecheck">
												<FormGroup check>
													<Label check>
														<Input type="checkbox" />{' '}
														<span className="form-check-sign">
															<span className="check"></span>
														</span>
													</Label>
												</FormGroup>
											</td>
											<td>TUESDAY 221018 This triplet</td>
											<td>35,980</td>
											<td>1,560</td>
											<td>30%</td>
											<td>12:49 PM - 26/Oct/2022</td>
											<td className="text-right">
                                                <Button color="info" size="sm">
                                                RESEND
												</Button>
											</td>
										</tr>

										<tr>
											<td className="tablecheck">
												<FormGroup check>
													<Label check>
														<Input type="checkbox" />{' '}
														<span className="form-check-sign">
															<span className="check"></span>
														</span>
													</Label>
												</FormGroup>
											</td>
											<td>TUESDAY 221018 This triplet</td>
											<td>35,980</td>
											<td>1,560</td>
											<td>30%</td>
											<td>12:49 PM - 26/Oct/2022</td>
											<td className="text-right">
                                                <Button color="info" size="sm">
                                                RESEND
												</Button>
											</td>
										</tr>

										<tr>
											<td className="tablecheck">
												<FormGroup check>
													<Label check>
														<Input type="checkbox" />{' '}
														<span className="form-check-sign">
															<span className="check"></span>
														</span>
													</Label>
												</FormGroup>
											</td>
											<td>TUESDAY 221018 This triplet</td>
											<td>35,980</td>
											<td>1,560</td>
											<td>30%</td>
											<td>12:49 PM - 26/Oct/2022</td>
											<td className="text-right">
                                                <Button color="info" size="sm">
                                                RESEND
												</Button>
											</td>
										</tr>

										<tr>
											<td className="tablecheck">
												<FormGroup check>
													<Label check>
														<Input type="checkbox" />{' '}
														<span className="form-check-sign">
															<span className="check"></span>
														</span>
													</Label>
												</FormGroup>
											</td>
											<td>TUESDAY 221018 This triplet</td>
											<td>35,980</td>
											<td>1,560</td>
											<td>30%</td>
											<td>12:49 PM - 26/Oct/2022</td>
											<td className="text-right">
                                                <Button color="info" size="sm">
                                                RESEND
												</Button>
											</td>
										</tr>
									</tbody>
								</Table>

                                <div className="paging d-flex justify-content-center">
                                    <Pagination aria-label="pagination">
                                        <PaginationItem>
                                            <PaginationLink previous href="#">
                                                Previous
                                            </PaginationLink>
                                        </PaginationItem>

                                        <div className="pages">
                                            Page 
                                            <a href="#"> 1 </a>
                                            of
                                            <a href="#"> 48 </a>
                                        </div>

                                        <PaginationItem>
                                            <PaginationLink next href="#">
                                                Next
                                            </PaginationLink>
                                        </PaginationItem>
                                    </Pagination>
                                </div>
							</CardBody>
						</Card>
					</Col>
				</Row>
            </div>
        </>
    )
}

export default PushNotifications;