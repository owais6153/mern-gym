import React, {useState} from "react";
import Loder from "../../components/Loder/Loder";
import { 
  Button,
} from "reactstrap";
import { connect } from "react-redux"

function SaveAndPublish (props) {
    const [showStatusField, setShowStatusField] = useState(false);

    return (
      <>
        { (props.status_field && showStatusField) ? <input type="hidden" name="status" id="status" value="1" /> : '' }
        <Button type="submit" color="primary" disabled={props.show_loder == 1 ? true:false} onClick={()=>setShowStatusField(true)}>
            Save & Publish 123
            {
              props.show_loder == 1 ?
                <Loder />
              :
                <i className="white">
                  <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.98584 14.4586C9.39209 14.4586 9.73584 14.1461 9.73584 13.7086V7.45863H12.9546C13.6421 7.45863 13.9546 6.67738 13.4858 6.17738L8.01709 0.677383C7.70459 0.396133 7.23584 0.396133 6.95459 0.677383L1.45459 6.17738C0.98584 6.67738 1.29834 7.45863 1.98584 7.45863H5.23584V13.7086C5.23584 14.1461 5.54834 14.4586 5.98584 14.4586H8.98584Z" fill="white"/>
                  </svg>
                </i>
            }
        </Button>
      </>
    )
}

const mapStateToProps = state => ({
  show_loder: state.commonReducer.show_loder,
})

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SaveAndPublish)