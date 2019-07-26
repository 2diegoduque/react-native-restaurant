import t from "tcomb-form-native";
import formValidation from "../utils/Validation";
import inputTemplate from "./templates/Input";

export const LoginStruct = t.struct({
  email: formValidation.email,
  password: formValidation.password
});

export const LoginOptions = {
  fields: {
    email: {
      template: inputTemplate,
      config: {
        placeholder: "Correo Electrónico *",
        iconType: "feather",
        iconName: "mail"
      }
    },
    password: {
      template: inputTemplate,
      config: {
        placeholder: "Contraseña *",
        iconType: "feather",
        iconName: "lock",
        password: true,
        secureTextEntry: true
      }
    }
  }
};
