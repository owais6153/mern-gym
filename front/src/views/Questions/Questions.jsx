import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { 
    Card, 
    CardBody, 
    CardHeader, 
    Row, 
    Col,
    Button,
} from "reactstrap";
import { getQuestionsListAction, QuestionsDeleteAction } from "../../redux/actions/questionsAction";
import { connect } from "react-redux"
import { useNavigate } from "react-router-dom";
import DeleteIcon from "../../components/Icons/DeleteIcon";

function Questions (props) {
    const navigate = useNavigate()
    const [currentPageNumber, setcurrentPageNumber] = useState(1);
    useEffect(()=>{
      if(currentPageNumber) props.getQuestionsListAction(currentPageNumber).then(response => {});
    },[currentPageNumber]);

    const deleteClickHandler = (id) => {
      props.QuestionsDeleteAction(id).then(response => {
        if(response) props.getQuestionsListAction(currentPageNumber);
      });
    }
    return (
      <>
        <Col md="6">
          <Card className="card-plain">
            <CardHeader>
                <div className="d-flex justify-content-between">
                    <div className="heading">
                        <h4 className="card-title mb-0">Personlization Questions</h4>
                        <p>Recent</p>
                    </div>
                </div>
            </CardHeader>

            <CardBody className="pt-0">
                <div className="overflow-scroll-vertical" >
                  {props.questions && props.questions.map((questions) => (
                    <div className="tpf-horizontal-card with-bg">
                        <Row className="my-3 p-3">
                            <Col lg="10" className="d-flex align-items-center ">
                                <div className="title">
                                    <h5 className="card-title font-weight-bold">{questions.title}</h5>
                                    {/* <p>Text</p> */}
                                </div>
                            </Col>

                            <Col lg="2" className="d-flex justify-content-end">
                                <Button color="primary" className="tpf-btn" onClick={()=>{
                                    navigate('/admin/questions/edit/'+questions.id, { replace: true, state: questions })
                                  }}
                                >
                                    <i className="fa fa-pen"/>{" "}
                                </Button>
                                <Button className="btn-icon" color="warning" size="sm" onClick={()=>deleteClickHandler(questions.id)}>
                                  <DeleteIcon />
                                </Button>
                            </Col>
                        </Row>
                    </div>
                  ))}
                </div>

                <Button color="primary" className="btn-full" onClick={()=>{navigate('/admin/questions/create')}}>
                    Add a New Question
                    <i className="fa fa-plus ml-2"/>{" "}
                </Button>
            </CardBody>
          </Card>
        </Col>
      </>
    )
}

const mapStateToProps = state => ({
  questions: state.questionsReducer.questions,
  questions_pagination: state.questionsReducer.questions_pagination,
})

const mapDispatchToProps = (dispatch) => ({
  getQuestionsListAction: (data, navigate) => dispatch( getQuestionsListAction(data, navigate) ),
  QuestionsDeleteAction: (data, navigate) => dispatch( QuestionsDeleteAction(data, navigate) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Questions)