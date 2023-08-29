

import React, {useState} from "react";
import Loder from "../../components/Loder/Loder";
import { 
  Button,
} from "reactstrap";
import { connect } from "react-redux"
import { useNavigate } from "react-router-dom";

function Discart (props) {
    const navigate = useNavigate()

    const [showStatusField, setShowStatusField] = useState(false);
    return (
      <>
        {/* { (props.status_field && showStatusField) ? <input type="hidden" name="status" id="status" value="0" /> : '' } */}
        <Button type="reset" color="default" disabled={props.show_loder == 1 ? true:false} onClick={()=>navigate("/admin/"+props.back)}>
            discard
            {
              props.show_loder == 1 ?
                <Loder />
              :
                <i className="fa fa-trash warning"/>
            }
        </Button>
      </>
    )
}

const mapStateToProps = state => ({
  show_loder: state.commonReducer.show_loder,
})

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Discart)