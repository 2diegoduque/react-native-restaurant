import React, { Component } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity
} from "react-native";
import { Image } from "react-native";
import ActionButton from "react-native-action-button";
import firebaseApp from "../../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: false,
      restaurants: null,
      startRestaurants: null,
      limitRestaurants: 8,
      loading: true
    };
  }

  componentDidMount() {
    this.checkLogin();
    this.loadRestaurant();
  }

  checkLogin = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          login: true
        });
      } else {
        this.setState({
          login: false
        });
      }
    });
  };

  goToScreem = (nameScreen, params) => {
    this.props.navigation.navigate(nameScreen, params);
  };

  renderActionButton = () => {
    return this.state.login ? (
      <ActionButton
        buttonColor="#00a680"
        onPress={() => {
          this.goToScreem("AddRestaurant", { loadRestaurant: this.loadRestaurant });
        }}
      />
    ) : null;
  };

  loadRestaurant = async () => {
    const resultRestaurants = [];
    const request = db
      .collection("restaurants")
      .orderBy("createAt", "desc")
      .limit(this.state.limitRestaurants);
    await request.get().then(result => {
      this.setState({
        startRestaurants: result.docs[result.docs.length - 1]
      });
      result.forEach(doc => {
        let restaurant = doc.data();
        restaurant.id = doc.id;
        resultRestaurants.push(restaurant);
      });
      this.setState({
        restaurants: resultRestaurants
      });
    });
  };

  _clickRestaurant = restaurant => {
    this.goToScreem("DetailRestaurant", restaurant);
  };

  _handleLoadMore = async () => {
    let resultRestaurants = this.state.restaurants;
    const request = db
      .collection("restaurants")
      .orderBy("createAt", "desc")
      .startAfter(this.state.startRestaurants.data().createAt)
      .limit(this.state.limitRestaurants);

    await request.get().then(listRestaurants => {
      if (listRestaurants.docs.length > 0) {
        this.setState({
          startRestaurants: listRestaurants.docs[listRestaurants.docs.length - 1]
        });
        listRestaurants.forEach(doc => {
          let restaurant = doc.data();
          restaurant.id = doc.id;
          resultRestaurants.push(restaurant);
        });
        this.setState({
          restaurants: resultRestaurants
        });
      } else {
        this.setState({
          loading: false
        });
      }
    });
  };

  _renderFooter = () => {
    if (this.state.loading) {
      return (
        <View style={styles.loadingInfiniteScroll}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return (
        <View style={styles.textInfiniteScroll}>
          <Text>No hay mas restaurantes</Text>
        </View>
      );
    }
  };

  renderFlatList = restaurants => {
    if (restaurants) {
      return (
        <FlatList
          data={restaurants}
          keyExtractor={(item, index) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this._clickRestaurant(item)}>
              <View style={styles.viewItemRestaurant}>
                <View style={styles.viewImageRestaurant}>
                  <Image
                    resizeMode="cover"
                    source={{ uri: item.image }}
                    style={styles.imageRestaurant}
                  />
                </View>
                <View>
                  <Text style={styles.textNameRestaurant}>{item.name}</Text>
                  <Text style={styles.textAddressRestaurant}>
                    {item.address}, {item.city}
                  </Text>
                  <Text style={styles.textDescriptionRestaurant}>
                    {item.description.substr(0, 60)}...
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          onEndReached={this._handleLoadMore}
          onEndReachedThreshold={0}
          ListFooterComponent={this._renderFooter()}
        />
      );
    } else {
      return (
        <View style={styles.viewActivityIndicator}>
          <ActivityIndicator size="large" />
          <Text>Cargando Restaurantes</Text>
        </View>
      );
    }
  };

  render() {
    return (
      <View style={styles.viewBody}>
        {this.renderFlatList(this.state.restaurants)}
        {this.renderActionButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  },
  viewActivityIndicator: {
    marginTop: 20,
    alignItems: "center"
  },
  viewItemRestaurant: {
    flexDirection: "row",
    margin: 10
  },
  imageRestaurant: {
    width: 80,
    height: 80
  },
  textNameRestaurant: {
    fontWeight: "bold"
  },
  viewImageRestaurant: {
    marginRight: 15
  },
  textAddressRestaurant: {
    paddingTop: 2,
    color: "grey"
  },
  textDescriptionRestaurant: {
    paddingTop: 2,
    color: "grey",
    width: 300
  },
  loadingInfiniteScroll: {
    marginTop: 10,
    marginBottom: 30
  },
  textInfiniteScroll: {
    marginTop: 10,
    marginBottom: 30,
    alignItems: "center"
  }
});
