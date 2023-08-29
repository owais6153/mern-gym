import React, { useState, useEffect } from "react";
import { 
    Pagination, PaginationItem, PaginationLink,
} from "reactstrap";

function PaginationComponent (props) {
    const UpdatePageNumberFunction = (value) => {
      props.setcurrentPageNumber(value);
    }
    return (
        <>
            <div className="paging d-flex justify-content-center">
                <Pagination aria-label="pagination">
                    <PaginationItem>
                        <PaginationLink previous onClick={() => UpdatePageNumberFunction(props.previous)}>
                            Previous
                        </PaginationLink>
                    </PaginationItem>

                    <div className="pages d-none d-sm-block">
                        Page 
                        <a href="#"> {props.current_page} </a>
                        of
                        <a href="#"> {props.total_pages} </a>
                    </div>

                    <PaginationItem>
                        <PaginationLink next onClick={() => UpdatePageNumberFunction(props.next)}>
                            Next
                        </PaginationLink>
                    </PaginationItem>
                </Pagination>
            </div>
        </>
    )
}

export default PaginationComponent