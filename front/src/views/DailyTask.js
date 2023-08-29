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

function DailyTask () {
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
											Daily Tasks
											<Badge color="info" pill>8,945</Badge>
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
												<Link to="/admin/new-daily-task">
													<Button color="primary">
														Create new Recipe
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
											<th></th>
											<th>ID</th>
											<th>Title</th>
											<th>Level</th>
											<th>Uploaded</th>
											<th className="text-center">Completed</th>
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
											<td className="thumbnail">
												<figure className="tpf-list-img">
													<img src={anime3} alt="..." />
												</figure>
											</td>
											<td>TPF-00951</td>
											<td>Maecenas nunc eget lacinia pharetra.</td>
											<td>Beginner</td>
											<td>12:49 PM - 26/Oct/2022</td>
											<td className="text-center">35,980</td>
											<td className="text-right">
												<Button className="btn-icon" color="info" size="sm">
													<i>
														<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M7.9504 2.66666L0.891808 9.72525L0.587121 12.6198C0.536339 13.0006 0.866417 13.3307 1.24728 13.2799L4.14181 12.9753L11.2004 5.91666L7.9504 2.66666ZM13.2063 2.18423L11.6828 0.660797C11.2258 0.178375 10.4387 0.178375 9.95626 0.660797L8.53439 2.08267L11.7844 5.33267L13.2063 3.9108C13.6887 3.42838 13.6887 2.64127 13.2063 2.18423Z" fill="white"/>
														</svg>
													</i>
												</Button>{` `}
												<Button className="btn-icon" color="warning" size="sm">
													<i>
														<svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M11.4293 0.902313H8.38241L8.1285 0.445282C8.02694 0.242157 7.79842 0.0898132 7.5953 0.0898132H4.67538C4.47225 0.0898132 4.21835 0.242157 4.14217 0.445282L3.91366 0.902313H0.866784C0.638268 0.902313 0.460534 1.10544 0.460534 1.30856V2.12106C0.460534 2.34958 0.638268 2.52731 0.866784 2.52731H11.4293C11.6324 2.52731 11.8355 2.34958 11.8355 2.12106V1.30856C11.8355 1.10544 11.6324 0.902313 11.4293 0.902313ZM1.80624 11.9472C1.83163 12.582 2.39022 13.0898 3.02499 13.0898H9.24569C9.88046 13.0898 10.439 12.582 10.4644 11.9472L11.023 3.33981H1.27303L1.80624 11.9472Z" fill="white"/>
														</svg>
													</i>
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
											<td className="thumbnail">
												<figure className="tpf-list-img">
													<img src={anime3} alt="..." />
												</figure>
											</td>
											<td>TPF-00951</td>
											<td>Maecenas nunc eget lacinia pharetra.</td>
											<td>Beginner</td>
											<td>12:49 PM - 26/Oct/2022</td>
											<td className="text-center">35,980</td>
											<td className="text-right">
												<Button className="btn-icon" color="info" size="sm">
													<i>
														<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M7.9504 2.66666L0.891808 9.72525L0.587121 12.6198C0.536339 13.0006 0.866417 13.3307 1.24728 13.2799L4.14181 12.9753L11.2004 5.91666L7.9504 2.66666ZM13.2063 2.18423L11.6828 0.660797C11.2258 0.178375 10.4387 0.178375 9.95626 0.660797L8.53439 2.08267L11.7844 5.33267L13.2063 3.9108C13.6887 3.42838 13.6887 2.64127 13.2063 2.18423Z" fill="white"/>
														</svg>
													</i>
												</Button>{` `}
												<Button className="btn-icon" color="warning" size="sm">
													<i>
														<svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M11.4293 0.902313H8.38241L8.1285 0.445282C8.02694 0.242157 7.79842 0.0898132 7.5953 0.0898132H4.67538C4.47225 0.0898132 4.21835 0.242157 4.14217 0.445282L3.91366 0.902313H0.866784C0.638268 0.902313 0.460534 1.10544 0.460534 1.30856V2.12106C0.460534 2.34958 0.638268 2.52731 0.866784 2.52731H11.4293C11.6324 2.52731 11.8355 2.34958 11.8355 2.12106V1.30856C11.8355 1.10544 11.6324 0.902313 11.4293 0.902313ZM1.80624 11.9472C1.83163 12.582 2.39022 13.0898 3.02499 13.0898H9.24569C9.88046 13.0898 10.439 12.582 10.4644 11.9472L11.023 3.33981H1.27303L1.80624 11.9472Z" fill="white"/>
														</svg>
													</i>
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
											<td className="thumbnail">
												<figure className="tpf-list-img">
													<img src={anime3} alt="..." />
												</figure>
											</td>
											<td>TPF-00951</td>
											<td>Maecenas nunc eget lacinia pharetra.</td>
											<td>Beginner</td>
											<td>12:49 PM - 26/Oct/2022</td>
											<td className="text-center">35,980</td>
											<td className="text-right">
												<Button className="btn-icon" color="info" size="sm">
													<i>
														<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M7.9504 2.66666L0.891808 9.72525L0.587121 12.6198C0.536339 13.0006 0.866417 13.3307 1.24728 13.2799L4.14181 12.9753L11.2004 5.91666L7.9504 2.66666ZM13.2063 2.18423L11.6828 0.660797C11.2258 0.178375 10.4387 0.178375 9.95626 0.660797L8.53439 2.08267L11.7844 5.33267L13.2063 3.9108C13.6887 3.42838 13.6887 2.64127 13.2063 2.18423Z" fill="white"/>
														</svg>
													</i>
												</Button>{` `}
												<Button className="btn-icon" color="warning" size="sm">
													<i>
														<svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M11.4293 0.902313H8.38241L8.1285 0.445282C8.02694 0.242157 7.79842 0.0898132 7.5953 0.0898132H4.67538C4.47225 0.0898132 4.21835 0.242157 4.14217 0.445282L3.91366 0.902313H0.866784C0.638268 0.902313 0.460534 1.10544 0.460534 1.30856V2.12106C0.460534 2.34958 0.638268 2.52731 0.866784 2.52731H11.4293C11.6324 2.52731 11.8355 2.34958 11.8355 2.12106V1.30856C11.8355 1.10544 11.6324 0.902313 11.4293 0.902313ZM1.80624 11.9472C1.83163 12.582 2.39022 13.0898 3.02499 13.0898H9.24569C9.88046 13.0898 10.439 12.582 10.4644 11.9472L11.023 3.33981H1.27303L1.80624 11.9472Z" fill="white"/>
														</svg>
													</i>
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
											<td className="thumbnail">
												<figure className="tpf-list-img">
													<img src={anime3} alt="..." />
												</figure>
											</td>
											<td>TPF-00951</td>
											<td>Maecenas nunc eget lacinia pharetra.</td>
											<td>Beginner</td>
											<td>12:49 PM - 26/Oct/2022</td>
											<td className="text-center">35,980</td>
											<td className="text-right">
												<Button className="btn-icon" color="info" size="sm">
													<i>
														<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M7.9504 2.66666L0.891808 9.72525L0.587121 12.6198C0.536339 13.0006 0.866417 13.3307 1.24728 13.2799L4.14181 12.9753L11.2004 5.91666L7.9504 2.66666ZM13.2063 2.18423L11.6828 0.660797C11.2258 0.178375 10.4387 0.178375 9.95626 0.660797L8.53439 2.08267L11.7844 5.33267L13.2063 3.9108C13.6887 3.42838 13.6887 2.64127 13.2063 2.18423Z" fill="white"/>
														</svg>
													</i>
												</Button>{` `}
												<Button className="btn-icon" color="warning" size="sm">
													<i>
														<svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M11.4293 0.902313H8.38241L8.1285 0.445282C8.02694 0.242157 7.79842 0.0898132 7.5953 0.0898132H4.67538C4.47225 0.0898132 4.21835 0.242157 4.14217 0.445282L3.91366 0.902313H0.866784C0.638268 0.902313 0.460534 1.10544 0.460534 1.30856V2.12106C0.460534 2.34958 0.638268 2.52731 0.866784 2.52731H11.4293C11.6324 2.52731 11.8355 2.34958 11.8355 2.12106V1.30856C11.8355 1.10544 11.6324 0.902313 11.4293 0.902313ZM1.80624 11.9472C1.83163 12.582 2.39022 13.0898 3.02499 13.0898H9.24569C9.88046 13.0898 10.439 12.582 10.4644 11.9472L11.023 3.33981H1.27303L1.80624 11.9472Z" fill="white"/>
														</svg>
													</i>
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
											<td className="thumbnail">
												<figure className="tpf-list-img">
													<img src={anime3} alt="..." />
												</figure>
											</td>
											<td>TPF-00951</td>
											<td>Maecenas nunc eget lacinia pharetra.</td>
											<td>Beginner</td>
											<td>12:49 PM - 26/Oct/2022</td>
											<td className="text-center">35,980</td>
											<td className="text-right">
												<Button className="btn-icon" color="info" size="sm">
													<i>
														<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M7.9504 2.66666L0.891808 9.72525L0.587121 12.6198C0.536339 13.0006 0.866417 13.3307 1.24728 13.2799L4.14181 12.9753L11.2004 5.91666L7.9504 2.66666ZM13.2063 2.18423L11.6828 0.660797C11.2258 0.178375 10.4387 0.178375 9.95626 0.660797L8.53439 2.08267L11.7844 5.33267L13.2063 3.9108C13.6887 3.42838 13.6887 2.64127 13.2063 2.18423Z" fill="white"/>
														</svg>
													</i>
												</Button>{` `}
												<Button className="btn-icon" color="warning" size="sm">
													<i>
														<svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M11.4293 0.902313H8.38241L8.1285 0.445282C8.02694 0.242157 7.79842 0.0898132 7.5953 0.0898132H4.67538C4.47225 0.0898132 4.21835 0.242157 4.14217 0.445282L3.91366 0.902313H0.866784C0.638268 0.902313 0.460534 1.10544 0.460534 1.30856V2.12106C0.460534 2.34958 0.638268 2.52731 0.866784 2.52731H11.4293C11.6324 2.52731 11.8355 2.34958 11.8355 2.12106V1.30856C11.8355 1.10544 11.6324 0.902313 11.4293 0.902313ZM1.80624 11.9472C1.83163 12.582 2.39022 13.0898 3.02499 13.0898H9.24569C9.88046 13.0898 10.439 12.582 10.4644 11.9472L11.023 3.33981H1.27303L1.80624 11.9472Z" fill="white"/>
														</svg>
													</i>
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
											<td className="thumbnail">
												<figure className="tpf-list-img">
													<img src={anime3} alt="..." />
												</figure>
											</td>
											<td>TPF-00951</td>
											<td>Maecenas nunc eget lacinia pharetra.</td>
											<td>Beginner</td>
											<td>12:49 PM - 26/Oct/2022</td>
											<td className="text-center">35,980</td>
											<td className="text-right">
												<Button className="btn-icon" color="info" size="sm">
													<i>
														<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M7.9504 2.66666L0.891808 9.72525L0.587121 12.6198C0.536339 13.0006 0.866417 13.3307 1.24728 13.2799L4.14181 12.9753L11.2004 5.91666L7.9504 2.66666ZM13.2063 2.18423L11.6828 0.660797C11.2258 0.178375 10.4387 0.178375 9.95626 0.660797L8.53439 2.08267L11.7844 5.33267L13.2063 3.9108C13.6887 3.42838 13.6887 2.64127 13.2063 2.18423Z" fill="white"/>
														</svg>
													</i>
												</Button>{` `}
												<Button className="btn-icon" color="warning" size="sm">
													<i>
														<svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M11.4293 0.902313H8.38241L8.1285 0.445282C8.02694 0.242157 7.79842 0.0898132 7.5953 0.0898132H4.67538C4.47225 0.0898132 4.21835 0.242157 4.14217 0.445282L3.91366 0.902313H0.866784C0.638268 0.902313 0.460534 1.10544 0.460534 1.30856V2.12106C0.460534 2.34958 0.638268 2.52731 0.866784 2.52731H11.4293C11.6324 2.52731 11.8355 2.34958 11.8355 2.12106V1.30856C11.8355 1.10544 11.6324 0.902313 11.4293 0.902313ZM1.80624 11.9472C1.83163 12.582 2.39022 13.0898 3.02499 13.0898H9.24569C9.88046 13.0898 10.439 12.582 10.4644 11.9472L11.023 3.33981H1.27303L1.80624 11.9472Z" fill="white"/>
														</svg>
													</i>
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
											<td className="thumbnail">
												<figure className="tpf-list-img">
													<img src={anime3} alt="..." />
												</figure>
											</td>
											<td>TPF-00951</td>
											<td>Maecenas nunc eget lacinia pharetra.</td>
											<td>Beginner</td>
											<td>12:49 PM - 26/Oct/2022</td>
											<td className="text-center">35,980</td>
											<td className="text-right">
												<Button className="btn-icon" color="info" size="sm">
													<i>
														<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M7.9504 2.66666L0.891808 9.72525L0.587121 12.6198C0.536339 13.0006 0.866417 13.3307 1.24728 13.2799L4.14181 12.9753L11.2004 5.91666L7.9504 2.66666ZM13.2063 2.18423L11.6828 0.660797C11.2258 0.178375 10.4387 0.178375 9.95626 0.660797L8.53439 2.08267L11.7844 5.33267L13.2063 3.9108C13.6887 3.42838 13.6887 2.64127 13.2063 2.18423Z" fill="white"/>
														</svg>
													</i>
												</Button>{` `}
												<Button className="btn-icon" color="warning" size="sm">
													<i>
														<svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M11.4293 0.902313H8.38241L8.1285 0.445282C8.02694 0.242157 7.79842 0.0898132 7.5953 0.0898132H4.67538C4.47225 0.0898132 4.21835 0.242157 4.14217 0.445282L3.91366 0.902313H0.866784C0.638268 0.902313 0.460534 1.10544 0.460534 1.30856V2.12106C0.460534 2.34958 0.638268 2.52731 0.866784 2.52731H11.4293C11.6324 2.52731 11.8355 2.34958 11.8355 2.12106V1.30856C11.8355 1.10544 11.6324 0.902313 11.4293 0.902313ZM1.80624 11.9472C1.83163 12.582 2.39022 13.0898 3.02499 13.0898H9.24569C9.88046 13.0898 10.439 12.582 10.4644 11.9472L11.023 3.33981H1.27303L1.80624 11.9472Z" fill="white"/>
														</svg>
													</i>
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
											<td className="thumbnail">
												<figure className="tpf-list-img">
													<img src={anime3} alt="..." />
												</figure>
											</td>
											<td>TPF-00951</td>
											<td>Maecenas nunc eget lacinia pharetra.</td>
											<td>Beginner</td>
											<td>12:49 PM - 26/Oct/2022</td>
											<td className="text-center">35,980</td>
											<td className="text-right">
												<Button className="btn-icon" color="info" size="sm">
													<i>
														<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M7.9504 2.66666L0.891808 9.72525L0.587121 12.6198C0.536339 13.0006 0.866417 13.3307 1.24728 13.2799L4.14181 12.9753L11.2004 5.91666L7.9504 2.66666ZM13.2063 2.18423L11.6828 0.660797C11.2258 0.178375 10.4387 0.178375 9.95626 0.660797L8.53439 2.08267L11.7844 5.33267L13.2063 3.9108C13.6887 3.42838 13.6887 2.64127 13.2063 2.18423Z" fill="white"/>
														</svg>
													</i>
												</Button>{` `}
												<Button className="btn-icon" color="warning" size="sm">
													<i>
														<svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M11.4293 0.902313H8.38241L8.1285 0.445282C8.02694 0.242157 7.79842 0.0898132 7.5953 0.0898132H4.67538C4.47225 0.0898132 4.21835 0.242157 4.14217 0.445282L3.91366 0.902313H0.866784C0.638268 0.902313 0.460534 1.10544 0.460534 1.30856V2.12106C0.460534 2.34958 0.638268 2.52731 0.866784 2.52731H11.4293C11.6324 2.52731 11.8355 2.34958 11.8355 2.12106V1.30856C11.8355 1.10544 11.6324 0.902313 11.4293 0.902313ZM1.80624 11.9472C1.83163 12.582 2.39022 13.0898 3.02499 13.0898H9.24569C9.88046 13.0898 10.439 12.582 10.4644 11.9472L11.023 3.33981H1.27303L1.80624 11.9472Z" fill="white"/>
														</svg>
													</i>
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
											<td className="thumbnail">
												<figure className="tpf-list-img">
													<img src={anime3} alt="..." />
												</figure>
											</td>
											<td>TPF-00951</td>
											<td>Maecenas nunc eget lacinia pharetra.</td>
											<td>Beginner</td>
											<td>12:49 PM - 26/Oct/2022</td>
											<td className="text-center">35,980</td>
											<td className="text-right">
												<Button className="btn-icon" color="info" size="sm">
													<i>
														<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M7.9504 2.66666L0.891808 9.72525L0.587121 12.6198C0.536339 13.0006 0.866417 13.3307 1.24728 13.2799L4.14181 12.9753L11.2004 5.91666L7.9504 2.66666ZM13.2063 2.18423L11.6828 0.660797C11.2258 0.178375 10.4387 0.178375 9.95626 0.660797L8.53439 2.08267L11.7844 5.33267L13.2063 3.9108C13.6887 3.42838 13.6887 2.64127 13.2063 2.18423Z" fill="white"/>
														</svg>
													</i>
												</Button>{` `}
												<Button className="btn-icon" color="warning" size="sm">
													<i>
														<svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M11.4293 0.902313H8.38241L8.1285 0.445282C8.02694 0.242157 7.79842 0.0898132 7.5953 0.0898132H4.67538C4.47225 0.0898132 4.21835 0.242157 4.14217 0.445282L3.91366 0.902313H0.866784C0.638268 0.902313 0.460534 1.10544 0.460534 1.30856V2.12106C0.460534 2.34958 0.638268 2.52731 0.866784 2.52731H11.4293C11.6324 2.52731 11.8355 2.34958 11.8355 2.12106V1.30856C11.8355 1.10544 11.6324 0.902313 11.4293 0.902313ZM1.80624 11.9472C1.83163 12.582 2.39022 13.0898 3.02499 13.0898H9.24569C9.88046 13.0898 10.439 12.582 10.4644 11.9472L11.023 3.33981H1.27303L1.80624 11.9472Z" fill="white"/>
														</svg>
													</i>
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
											<td className="thumbnail">
												<figure className="tpf-list-img">
													<img src={anime3} alt="..." />
												</figure>
											</td>
											<td>TPF-00951</td>
											<td>Maecenas nunc eget lacinia pharetra.</td>
											<td>Beginner</td>
											<td>12:49 PM - 26/Oct/2022</td>
											<td className="text-center">35,980</td>
											<td className="text-right">
												<Button className="btn-icon" color="info" size="sm">
													<i>
														<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M7.9504 2.66666L0.891808 9.72525L0.587121 12.6198C0.536339 13.0006 0.866417 13.3307 1.24728 13.2799L4.14181 12.9753L11.2004 5.91666L7.9504 2.66666ZM13.2063 2.18423L11.6828 0.660797C11.2258 0.178375 10.4387 0.178375 9.95626 0.660797L8.53439 2.08267L11.7844 5.33267L13.2063 3.9108C13.6887 3.42838 13.6887 2.64127 13.2063 2.18423Z" fill="white"/>
														</svg>
													</i>
												</Button>{` `}
												<Button className="btn-icon" color="warning" size="sm">
													<i>
														<svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M11.4293 0.902313H8.38241L8.1285 0.445282C8.02694 0.242157 7.79842 0.0898132 7.5953 0.0898132H4.67538C4.47225 0.0898132 4.21835 0.242157 4.14217 0.445282L3.91366 0.902313H0.866784C0.638268 0.902313 0.460534 1.10544 0.460534 1.30856V2.12106C0.460534 2.34958 0.638268 2.52731 0.866784 2.52731H11.4293C11.6324 2.52731 11.8355 2.34958 11.8355 2.12106V1.30856C11.8355 1.10544 11.6324 0.902313 11.4293 0.902313ZM1.80624 11.9472C1.83163 12.582 2.39022 13.0898 3.02499 13.0898H9.24569C9.88046 13.0898 10.439 12.582 10.4644 11.9472L11.023 3.33981H1.27303L1.80624 11.9472Z" fill="white"/>
														</svg>
													</i>
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
											<td className="thumbnail">
												<figure className="tpf-list-img">
													<img src={anime3} alt="..." />
												</figure>
											</td>
											<td>TPF-00951</td>
											<td>Maecenas nunc eget lacinia pharetra.</td>
											<td>Beginner</td>
											<td>12:49 PM - 26/Oct/2022</td>
											<td className="text-center">35,980</td>
											<td className="text-right">
												<Button className="btn-icon" color="info" size="sm">
													<i>
														<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M7.9504 2.66666L0.891808 9.72525L0.587121 12.6198C0.536339 13.0006 0.866417 13.3307 1.24728 13.2799L4.14181 12.9753L11.2004 5.91666L7.9504 2.66666ZM13.2063 2.18423L11.6828 0.660797C11.2258 0.178375 10.4387 0.178375 9.95626 0.660797L8.53439 2.08267L11.7844 5.33267L13.2063 3.9108C13.6887 3.42838 13.6887 2.64127 13.2063 2.18423Z" fill="white"/>
														</svg>
													</i>
												</Button>{` `}
												<Button className="btn-icon" color="warning" size="sm">
													<i>
														<svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M11.4293 0.902313H8.38241L8.1285 0.445282C8.02694 0.242157 7.79842 0.0898132 7.5953 0.0898132H4.67538C4.47225 0.0898132 4.21835 0.242157 4.14217 0.445282L3.91366 0.902313H0.866784C0.638268 0.902313 0.460534 1.10544 0.460534 1.30856V2.12106C0.460534 2.34958 0.638268 2.52731 0.866784 2.52731H11.4293C11.6324 2.52731 11.8355 2.34958 11.8355 2.12106V1.30856C11.8355 1.10544 11.6324 0.902313 11.4293 0.902313ZM1.80624 11.9472C1.83163 12.582 2.39022 13.0898 3.02499 13.0898H9.24569C9.88046 13.0898 10.439 12.582 10.4644 11.9472L11.023 3.33981H1.27303L1.80624 11.9472Z" fill="white"/>
														</svg>
													</i>
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

export default DailyTask;