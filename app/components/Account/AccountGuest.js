import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Button, Image } from "react-native-elements";

export default class AccountGuest extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.viewBody}>
        <Image
          source={require("../../../assets/img/image-my-account-guest-01.jpg")}
          style={styles.image}
          PlaceholderContent={<ActivityIndicator />}
          resizeMode="contain"
        />
        <Text style={styles.title}>Consulta tu perfil de Restaurantes</Text>
        <Text style={styles.textDescription}>
          ¿Como describirías tu mejor restaurante? Busca y visualiza los mejores restaurantes de una
          forma sencila, vota cual te ha gustado y comenta como ha sido tu experiencia
        </Text>
        <Button
          title="Ver tu perfil"
          buttonStyle={styles.btnProfile}
          onPress={() => this.props.goToScreen("Login")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 30,
    paddingRight: 30
  },
  image: {
    height: 300,
    marginBottom: 40
  },
  title: {
    fontWeight: "bold",
    fontSize: 19,
    marginBottom: 10
  },
  textDescription: {
    textAlign: "center"
  },
  btnProfile: {
    width: "100%",
    backgroundColor: "#00a680",
    marginTop: 30
  }
});
