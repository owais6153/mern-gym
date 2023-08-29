import React, { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { 
  FormGroup,
  Label,
  FormFeedback,
} from "reactstrap";

const MultiSelectDropdown = (props) => {
  const { heading, options, type, error } = props;
  const [selected, setSelected] = useState([]);
  const [DropDownOptions, setDropDownOptions] = useState([]);
  const [lastValue, setLastValue] = useState([]);

  useEffect(() => {
    if(options) {
      let optionsTemp = options.filter(value => {return value.type === type})
      let data = [];
      optionsTemp.map(v => {
        data.push({label: v.title,value:v.id })
      });
      setDropDownOptions(data);
    }
  }, [options])
  useEffect(() => {
    if(selected){
      console.log(selected)
      let data = [];
      selected.map(v => {
        data.push(v.value)
      });
      setLastValue(data)
    }
  }, [selected])
  return (
    <FormGroup className="col-lg-6">
      <Label for="category">{heading}</Label>
      {JSON.stringify(lastValue)}
      <MultiSelect options={DropDownOptions} value={selected} onChange={setSelected} labelledBy="Select" />
      { error && <FormFeedback>{error.category}</FormFeedback> }
      <input type="hidden" name="category" id="category" value={lastValue} /> 
    </FormGroup>
  );
};

export default MultiSelectDropdown;
