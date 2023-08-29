
import React from "react";
import { Spinner } from "reactstrap";

function Loder (props) {
    return (
      <>
        {" "}<Spinner size="sm" color={props.color ? props.color : "text-light"} />   
      </>
    )
}
export default Loder