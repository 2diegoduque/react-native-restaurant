import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Overlay, Input, Button, Icon } from "react-native-elements";

export default class OverlayThreeInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props
    };
  }

  onChangeInputOne = inputData => {
    this.setState({
      valueInputOne: inputData
    });
  };

  onChangeInputTwo = inputData => {
    this.setState({
      valueInputTwo: inputData
    });
  };

  onChangeInputThree = inputData => {
    this.setState({
      valueInputThree: inputData
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
            placeholder={this.state.placeholderOne}
            containerStyle={styles.inputContainer}
            onChangeText={value => this.onChangeInputOne(value)}
            value={this.state.valueInputOne}
            password={this.state.password}
            secureTextEntry={this.state.password}
          />
          <Input
            placeholder={this.state.placeholderTwo}
            containerStyle={styles.inputContainer}
            onChangeText={value => this.onChangeInputTwo(value)}
            value={this.state.valueInputTwo}
            password={this.state.password}
            secureTextEntry={this.state.password}
          />
          <Input
            placeholder={this.state.placeholderThree}
            containerStyle={styles.inputContainer}
            onChangeText={value => this.onChangeInputThree(value)}
            value={this.state.valueInputThree}
            password={this.state.password}
            secureTextEntry={this.state.password}
          />
          <Button
            title="Actualizar"
            buttonStyle={styles.buttonUpdate}
            onPress={() =>
              this.state.updateFunction(
                this.state.valueInputOne,
                this.state.valueInputTwo,
                this.state.valueInputThree
              )
            }
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
