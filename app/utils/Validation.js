import t from "tcomb-form-native";

export default (formValidation = {
  email: t.refinement(t.String, value => {
    // return /@/.test(value);
    const ruler = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return ruler.test(value);
  }),
  password: t.refinement(t.String, value => {
    return value.length >= 6;
  })
});
