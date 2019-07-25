import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { SearchBar } from "react-native-elements";

export default class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: ""
    };
  }

  _searchRestaurant = search => {
    this.setState({
      search
    });
  };
  render() {
    return (
      <View style={styles.viewBody}>
        <SearchBar
          placeholder="Buscar restaurante..."
          onChangeText={this._searchRestaurant}
          value={this.state.search}
          containerStyle={styles.searchBarContainer}
          lightTheme={true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
    // alignItems: "center",
    // justifyContent: "center",
    // backgroundColor: "#fff"
  },
  searchBarContainer: {
    marginBottom: 20
  }
});
