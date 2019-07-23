import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import t from "tcomb-form-native";
const Form = t.form.Form;
import { RegisterStruct, RegisterOptions } from "../../forms/Register";
import { Button, Image } from "react-native-elements";
import * as firebase from "firebase";
import Toast from "react-native-easy-toast";

export default class Register extends Component {
  constructor() {
    super();
    this.state = {
      registerStruct: RegisterStruct,
      registerOptions: RegisterOptions,
      formData: {
        name: "",
        email: "",
        password: "",
        passwordConfirmation: ""
      },
      formErrorMessage: "",
      showButtonLoading: false
    };
  }

  sendToRegister = () => {
    const { password, passwordConfirmation } = this.state.formData;
    if (password === passwordConfirmation) {
      const validate = this.refs.registerForm.getValue();
      if (validate) {
        this.setState({
          showButtonLoading: true
        });
        firebase
          .auth()
          .createUserWithEmailAndPassword(validate.email, validate.password)
          .then(resultFirebase => {
            this.setState({
              showButtonLoading: false
            });
            this.refs.toast.show("Registro exitoso", 500, () => {
              this.props.navigation.navigate("Account");
            });
          })
          .catch(error => {
            console.log("error: ", error);
            this.refs.toast.show("Correo electrónico ya esta en uso", 1700);
            this.setState({
              showButtonLoading: false
            });
          });
      } else {
        this.setState({
          formErrorMessage: "Formulario invalido"
        });
      }
    } else {
      this.setState({
        formErrorMessage: "Contraseñas no son iguales"
      });
    }
  };

  updateDataFormRegister = formValue => {
    this.setState({
      formData: formValue,
      formErrorMessage: ""
    });
  };

  render() {
    const { registerStruct, registerOptions, formErrorMessage, showButtonLoading } = this.state;
    return (
      <View style={styles.viewBody}>
        <Image
          source={require("../../../assets/img/5-tenedores-letras-icono-logo.png")}
          style={styles.logo}
          PlaceholderContent={<ActivityIndicator />}
          resizeMode="contain"
          containerStyle={styles.containerLogo}
        />
        <Form
          ref="registerForm"
          type={registerStruct}
          options={registerOptions}
          value={this.state.formData}
          onChange={formValue => this.updateDataFormRegister(formValue)}
        />
        {showButtonLoading ? (
          <Button
            disabled
            loading
            disabledStyle={{
              backgroundColor: "#00a680",
              marginTop: 40,
              marginLeft: 10,
              marginRight: 10
            }}
          />
        ) : (
          <Button
            buttonStyle={styles.buttonRegister}
            title="Unirse"
            onPress={() => this.sendToRegister()}
          />
        )}
        <Text style={styles.formErrorMessage}>{formErrorMessage}</Text>
        <Toast
          ref="toast"
          // style={{ backgroundColor: "red" }}
          position="top"
          positionValue={50}
          fadeInDuration={1000}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{ color: "white" }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    justifyContent: "center",
    marginRight: 40,
    marginLeft: 40
  },
  buttonRegister: {
    backgroundColor: "#00a680",
    marginTop: 40,
    marginLeft: 10,
    marginRight: 10
  },
  formErrorMessage: {
    color: "#f00",
    textAlign: "center",
    marginTop: 30
  },
  logo: {
    width: 300,
    height: 150
  },
  containerLogo: {
    alignItems: "center",
    marginBottom: 30
  }
});
