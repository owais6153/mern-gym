
const ConfigVariableDto = (data) => {
  return {
    id: data._id || null,
    identity: data.identity || null,
    value: data.value || null,
  };
};
export default ConfigVariableDto;
