import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { Card, Image, Rating } from "react-native-elements";

import firebaseApp from "../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default class TopFive extends Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurants: null
    };
  }

  componentDidMount = () => {
    this._loadTopFive();
  };

  _loadTopFive = async () => {
    let restaurants = db
      .collection("restaurants")
      .orderBy("rating", "desc")
      .limit(5);
    let listRestaurants = [];
    await restaurants.get().then(resolve => {
      resolve.forEach(doc => {
        data = doc.data();
        data.id = doc.id;
        listRestaurants.push(data);
      });
      this.setState({
        restaurants: listRestaurants
      });
    });
  };

  _clickRestaurant = restaurant => {
    this.props.navigation.navigate("DetailRestaurant", restaurant);
  };

  _renderRestaurants = restaunrants => {
    if (restaunrants) {
      return (
        <View>
          {restaunrants.map((restaurant, index) => {
            return (
              <TouchableOpacity key={index} onPress={() => this._clickRestaurant(restaurant)}>
                <Card key={index}>
                  <Image
                    style={styles.imageRestaurant}
                    resizeMode="cover"
                    source={{ uri: restaurant.image }}
                  />
                  <View style={styles.viewContainerInfo}>
                    <Text style={styles.titleRestaurant}>{restaurant.name}</Text>
                    <Rating
                      style={styles.ratingText}
                      imageSize={15}
                      startingValue={restaurant.rating}
                      readonly
                    />
                  </View>
                  <Text style={styles.description}>{restaurant.description}</Text>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    } else {
      return (
        <View style={styles.viewContainerLoading}>
          <ActivityIndicator style={styles.activityTop} size="large" />
          <Text>Cargando Top 5</Text>
        </View>
      );
    }
  };

  render() {
    return (
      <ScrollView style={styles.viewBody}>
        {this._renderRestaurants(this.state.restaurants)}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  },
  imageRestaurant: {
    width: "100%",
    height: 200
  },
  viewContainerInfo: {
    flexDirection: "row",
    marginTop: 10
  },
  titleRestaurant: {
    fontSize: 20,
    fontWeight: "bold"
  },
  ratingText: {
    position: "absolute",
    right: 0
  },
  description: {
    color: "gray",
    marginTop: 10,
    textAlign: "justify"
  },
  viewContainerLoading: {
    flex: 1,
    alignItems: "center",
    alignContent: "center",
    marginTop: 100
  },
  activityTop: {
    marginBottom: 10
  }
});
