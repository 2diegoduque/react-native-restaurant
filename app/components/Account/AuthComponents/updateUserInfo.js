import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { ListItem } from "react-native-elements";
import Toast from "react-native-easy-toast";

import OverlayOneInput from "../../Elements/OverlayOneInput";
import OverlayTwoInput from "../../Elements/OverlayTwoInput";
import OverlayThreeInput from "../../Elements/OverlayThreeInput";

export default class UpdateUserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      overlayComponent: null,
      menuItems: [
        {
          title: "Cambiar nombre y apellido",
          iconType: "material-community",
          iconNameRight: "chevron-right",
          iconColorRight: "#ccc",
          iconNameLeft: "account-circle",
          iconColorLeft: "#ccc",
          onPress: () =>
            this.openOverlayDisplayName(
              "Nombres y Apellidos",
              this.updateUserDisplayName,
              props.infoUser.displayName
            )
        },
        {
          title: "Cambiar correo electrónico",
          iconType: "material-community",
          iconNameRight: "chevron-right",
          iconColorRight: "#ccc",
          iconNameLeft: "at",
          iconColorLeft: "#ccc",
          onPress: () =>
            this.openOverlayEmail(
              "Nuevo correo electrónico",
              "Contraseña actual",
              this.updateUserEmail,
              props.infoUser.uid
            )
        },
        {
          title: "Cambiar contraseña",
          iconType: "material-community",
          iconNameRight: "chevron-right",
          iconColorRight: "#ccc",
          iconNameLeft: "lock-reset",
          iconColorLeft: "#ccc",
          onPress: () =>
            this.openOverlayPassword(
              "Contraseña actual",
              "Nueva contraseña",
              "Repetir nueva contraseña",
              this.updateUserPassword
            )
        }
      ]
    };
  }

  updateUserDisplayName = async newDisplayName => {
    if (newDisplayName) {
      this.state.updateUserDisplayName(newDisplayName);
    }
    this.setState({
      overlayComponent: null
    });
  };

  updateUserEmail = async (newEmail, password) => {
    if (this.state.infoUser.email != newEmail && password) {
      this.state.updateUserEmail(newEmail, password);
    }
    this.setState({
      overlayComponent: null
    });
  };

  updateUserPassword = async (password, newPassword, repeatPassword) => {
    if (password && newPassword && repeatPassword) {
      if (newPassword === repeatPassword) {
        if (password === newPassword) {
          this.refs.toast.show("La nueva contraseña no puede ser igual a la actual", 1700);
        } else {
          this.state.updateUserPassword(password, newPassword);
        }
      } else {
        this.refs.toast.show("Las nuevas contraseñas no son iguales", 1500);
      }
    } else {
      this.refs.toast.show("Debes ingresar todos los campos", 1500);
    }
    this.setState({
      overlayComponent: null
    });
  };

  openOverlayDisplayName = (placeholder, updateFunction, valueInput) => {
    this.setState({
      overlayComponent: (
        <OverlayOneInput
          isVisibleOverlay={true}
          placeholder={placeholder}
          updateFunction={updateFunction}
          valueInput={valueInput}
        />
      )
    });
  };

  openOverlayEmail = (placeholderOne, placeholderTwo, updateFunction, valueInputOne) => {
    this.setState({
      overlayComponent: (
        <OverlayTwoInput
          isVisibleOverlay={true}
          placeholderOne={placeholderOne}
          placeholderTwo={placeholderTwo}
          updateFunction={updateFunction}
          valueInputOne={valueInputOne}
          password={true}
        />
      )
    });
  };

  openOverlayPassword = (placeholderOne, placeholderTwo, placeholderThree, updateFunction) => {
    this.setState({
      overlayComponent: (
        <OverlayThreeInput
          isVisibleOverlay={true}
          placeholderOne={placeholderOne}
          placeholderTwo={placeholderTwo}
          placeholderThree={placeholderThree}
          updateFunction={updateFunction}
          password={true}
        />
      )
    });
  };

  render() {
    return (
      <View style={styles.viewBody}>
        {this.state.menuItems.map((item, i) => (
          <ListItem
            key={i}
            title={item.title}
            leftIcon={{ type: item.iconType, name: item.iconNameLeft, color: item.iconColorLeft }}
            rightIcon={{
              type: item.iconType,
              name: item.iconNameRight,
              color: item.iconColorRight
            }}
            onPress={item.onPress}
            containerStyle={styles.contentContainer}
          />
        ))}
        {this.state.overlayComponent}
        <Toast
          ref="toast"
          position="top"
          positionValue={0}
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
  contentContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3d3"
  }
});
