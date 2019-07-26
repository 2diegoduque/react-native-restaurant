import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { SearchBar, ListItem, Icon } from "react-native-elements";

import firebaseApp from "../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);
import { FireSQL } from "firesql";
const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" });

export default class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
      restaurants: null
    };
  }

  _searchRestaurant = async search => {
    listRestaurants = null;

    let restaurants = fireSQL.query(`
      SELECT * FROM restaurants WHERE name LIKE '${search}%'
    `);

    await restaurants
      .then(resolve => {
        listRestaurants = resolve;
      })
      .catch(() => {});

    this.setState({
      search,
      restaurants: listRestaurants
    });
  };

  _clickRestaurant = restaurant => {
    this.props.navigation.navigate("DetailRestaurant", restaurant);
  };

  _renderListRestaurants = restaurants => {
    if (restaurants) {
      return (
        <View>
          {restaurants.map((restaurant, index) => {
            return (
              <ListItem
                key={index}
                title={restaurant.name}
                leftAvatar={{ source: { uri: restaurant.image } }}
                rightIcon={<Icon type="material-comunity" name="chevron-right" />}
                onPress={() => this._clickRestaurant(restaurant)}
              />
            );
          })}
        </View>
      );
    } else {
      return (
        <View>
          <Text style={styles.titleNotRestaurants}>Busca tus restaurantes!</Text>
        </View>
      );
    }
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
        {this._renderListRestaurants(this.state.restaurants)}
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
  },
  titleNotRestaurants: {
    textAlign: "center"
  }
});
