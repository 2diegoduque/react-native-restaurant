import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Overlay, Input, Button, Icon } from "react-native-elements";

export default class OverlayOneInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props
    };
  }

  onChangeInput = inputData => {
    this.setState({
      valueInput: inputData
    });
  };

  render() {
    return (
      <Overlay
        isVisible={this.state.isVisibleOverlay}
        overlayBackgroundColor="transparent"
        overlayStyle={styles.overlayContainer}
      >
        <View style={styles.viewBody}>
          <Input
            placeholder={this.state.placeholder}
            containerStyle={styles.inputContainer}
            onChangeText={value => this.onChangeInput(value)}
            value={this.state.valueInput}
          />
          <Button
            title="Actualizar"
            buttonStyle={styles.buttonUpdate}
            onPress={() => this.state.updateFunction(this.state.valueInput)}
          />
          <Icon
            type="material-community"
            name="close-circle-outline"
            containerStyle={styles.iconContainer}
            size={30}
            onPress={() => this.state.updateFunction(null)}
          />
        </View>
      </Overlay>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderColor: "#00a680",
    borderWidth: 2
  },
  overlayContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  inputContainer: {
    marginBottom: 20
  },
  buttonUpdate: {
    backgroundColor: "#00a680"
  },
  iconContainer: {
    position: "absolute",
    right: -16,
    top: -16
  }
});
