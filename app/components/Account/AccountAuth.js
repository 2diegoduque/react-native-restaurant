import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import UserInfo from "./AuthComponents/UserInfo";

export default class AccountAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props
    };
  }

  render() {
    return (
      <View style={styles.viewBody}>
        <UserInfo logOut={this.state.logOut} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    height: "100%",
    backgroundColor: "#f2f2f2"
  }
});
