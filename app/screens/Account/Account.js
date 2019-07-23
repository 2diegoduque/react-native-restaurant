import React, { Component } from "react";
import { StyleSheet } from "react-native";
import * as firebase from "firebase";
import AccountGuest from "../../components/Account/AccountGuest";
import AccountAuth from "../../components/Account/AccountAuth";

export default class Account extends Component {
  constructor() {
    super();

    this.state = {
      login: false
    };
  }

  async componentDidMount() {
    await firebase.auth().onAuthStateChanged(status => {
      if (status) {
        this.setState({
          login: true
        });
      } else {
        this.setState({
          login: false
        });
      }
    });
  }

  goToScreen = nameScreen => {
    this.props.navigation.navigate(nameScreen);
  };

  logOut = () => {
    firebase.auth().signOut();
  };

  render() {
    if (this.state.login) {
      return <AccountAuth logOut={this.logOut} />;
    } else {
      return <AccountGuest goToScreen={this.goToScreen} />;
    }
  }
}

const styles = StyleSheet.create({});
