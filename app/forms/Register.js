import t from "tcomb-form-native";
import formValidation from "../utils/Validation";
import inputTemplate from "./templates/Input";

export const RegisterStruct = t.struct({
  name: t.String,
  email: formValidation.email,
  password: formValidation.password,
  passwordConfirmation: formValidation.password
});

export const RegisterOptions = {
  fields: {
    name: {
      template: inputTemplate,
      config: {
        placeholder: "Nombres y Apellidos *",
        errorMessage: "Campo requerido",
        iconType: "feather",
        iconName: "user"
      }
    },
    email: {
      template: inputTemplate,
      config: {
        placeholder: "Correo Electrónico *",
        errorMessage: "Correo Electrónico incorrecto",
        iconType: "feather",
        iconName: "mail"
      }
    },
    password: {
      template: inputTemplate,
      config: {
        placeholder: "Contraseña *",
        errorMessage: "Contraseña invalida",
        iconType: "feather",
        iconName: "lock",
        password: true,
        secureTextEntry: true
      }
    },
    passwordConfirmation: {
      template: inputTemplate,
      config: {
        placeholder: "Repite tu contraseña *",
        errorMessage: "Contraseña invalida",
        iconType: "feather",
        iconName: "lock",
        password: true,
        secureTextEntry: true
      }
    }
  }
};
