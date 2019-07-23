import React, { Component } from "react";
import { StyleSheet, View, ActivityIndicator, Text, ScrollView } from "react-native";
import { Image, Divider } from "react-native-elements";
import t from "tcomb-form-native";
const Form = t.form.Form;
import { LoginStruct, LoginOptions } from "../../forms/Login";
import { Button } from "react-native-elements";
import * as firebase from "firebase";
import Toast from "react-native-easy-toast";
import { SocialIcon } from "react-native-elements";
import FacebookApi from "../../utils/Social";
import * as Facebook from "expo-facebook";

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      formData: {
        email: "",
        password: ""
      },
      formErrorMessage: "",
      showButtonLoading: false
    };
  }

  goToScreen = nameScreen => {
    this.props.navigation.navigate(nameScreen);
  };

  updateDataFormLogin = formData => {
    this.setState({
      formData,
      formErrorMessage: ""
    });
  };

  sendToLogin = () => {
    const validate = this.refs.loginForm.getValue();
    if (validate) {
      this.setState({
        showButtonLoading: true
      });
      firebase
        .auth()
        .signInWithEmailAndPassword(validate.email, validate.password)
        .then(loginFirebase => {
          this.setState({
            showButtonLoading: false
          });
          this.props.navigation.goBack();
        })
        .catch(error => {
          console.log("error loginFirebase: ", error);
          this.refs.toast.show("Correo electrónico o Contraseña incorrectos", 1700);
          this.setState({
            showButtonLoading: false
          });
        });
    } else {
      this.setState({
        formErrorMessage: "Formulario invalido"
      });
    }
  };

  loginFacebook = async () => {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(
      FacebookApi.application_id,
      { permissions: FacebookApi.permissions }
    );
    if (type == "success") {
      const credentials = firebase.auth.FacebookAuthProvider.credential(token);
      firebase
        .auth()
        .signInWithCredential(credentials)
        .then(() => {
          this.props.navigation.goBack();
        })
        .catch(error => {
          this.refs.toast.show("Error login Facebook ", 700);
        });
    } else if (type == "cancel") {
      this.refs.toast.show("Inicio de sesión cancelado", 700);
    } else {
      this.refs.toast.show("Error login Facebook ", 700);
    }
  };

  render() {
    return (
      <ScrollView style={styles.viewBody} indicatorStyle="white">
        <Image
          source={require("../../../assets/img/5-tenedores-letras-icono-logo.png")}
          style={styles.logo}
          PlaceholderContent={<ActivityIndicator />}
          resizeMode="contain"
          containerStyle={styles.containerLogo}
        />
        <View style={styles.viewContainerForm}>
          <Form
            ref="loginForm"
            type={LoginStruct}
            options={LoginOptions}
            value={this.state.formData}
            onChange={formValue => this.updateDataFormLogin(formValue)}
          />
        </View>
        {this.state.showButtonLoading ? (
          <Button disabled loading disabledStyle={styles.buttonLogin} />
        ) : (
          <Button
            buttonStyle={styles.buttonLogin}
            title="Iniciar sesión"
            onPress={() => this.sendToLogin()}
          />
        )}
        <Text style={styles.textRegister}>
          ¿Aún no tienes un cuenta?
          <Text style={styles.buttonRegister} onPress={() => this.goToScreen("Register")}>
            {" "}
            Regístrate
          </Text>
        </Text>
        <Text style={styles.formErrorMessage}>{this.state.formErrorMessage}</Text>
        <Divider style={styles.divider} />
        <SocialIcon
          title="Iniciar con Facebook"
          button
          type="facebook"
          onPress={() => this.loginFacebook()}
        />
        <Toast
          ref="toast"
          // style={{ backgroundColor: "red" }}
          position="top"
          positionValue={0}
          fadeInDuration={1000}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{ color: "white" }}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 40
  },
  logo: {
    width: 300,
    height: 150
  },
  buttonLogin: {
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
  viewContainerForm: {
    marginTop: 40
  },
  containerLogo: {
    alignItems: "center"
  },
  divider: {
    backgroundColor: "#00a680",
    marginBottom: 20,
    marginTop: 20
  },
  textRegister: {
    textAlign: "center",
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10
  },
  buttonRegister: {
    color: "#00a680",
    fontWeight: "bold"
  }
});
