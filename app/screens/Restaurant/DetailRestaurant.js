import React, { Component } from "react";
import { StyleSheet, View, ActivityIndicator, FlatList, ScrollView } from "react-native";
import { Image, ListItem, Icon, Button, Text, Rating, Avatar } from "react-native-elements";
import Toast from "react-native-easy-toast";

import firebaseApp from "../../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default class DetailRestaurant extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reviews: null,
      startReview: null,
      loading: true,
      rating: 0
    };
  }

  componentDidMount() {
    this._loadReview();
  }

  _checkUserLogin = () => {
    let user = firebase.auth().currentUser;
    if (user) {
      return true;
    }
    return false;
  };

  _checkUserSendReview = () => {
    let user = firebase.auth().currentUser;
    if (user) {
      let user_id = user.uid;
      let restaurante_id = this.props.navigation.state.params.id;
      let reviewRef = db.collection("review");
      return reviewRef
        .where("idUser", "==", user_id)
        .where("idRestaurante", "==", restaurante_id)
        .get()
        .then(resolve => {
          if (resolve.size > 0) {
            return false;
          } else {
            return true;
          }
        });
    }
  };

  _goToScreenAddReview = () => {
    this._checkUserSendReview().then(resolve => {
      if (resolve) {
        let { id, name } = this.props.navigation.state.params;
        this.props.navigation.navigate("AddReviewRestaurant", {
          id,
          name,
          reloadReviews: this._loadReview
        });
      } else {
        this.refs.toast.show("Ya has enviado un comentario", 1000);
      }
    });
  };

  _loadReview = async () => {
    let restaurante_id = this.props.navigation.state.params.id;
    let listReview = [];
    let listRating = [];
    let queryReviews = db.collection("review").where("idRestaurante", "==", restaurante_id);
    return await queryReviews.get().then(resolve => {
      resolve.forEach(doc => {
        listReview.push(doc.data());
        listRating.push(doc.data().rating);
      });

      let sum = 0;
      if (listRating.length) {
        listRating.map(value => {
          sum += value;
        });
        sum = sum / listRating.length;
      }
      this.setState({
        startReview: resolve.docs[resolve.docs.length - 1],
        reviews: listReview,
        rating: sum.toFixed(2)
      });
    });
  };

  _renderFlatList = reviews => {
    if (reviews) {
      return (
        <FlatList
          data={reviews}
          renderItem={this._renderRow}
          keyExtractor={(item, index) => item.id}
          onEndReachedThreshold={0}
        />
      );
    } else {
      return (
        <View style={styles.viewStartLoadReview}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
  };

  _renderRow = item => {
    let createReview = new Date(item.item.createAt.seconds * 1000);
    return (
      <View style={styles.viewRowReview}>
        <View style={styles.viewRowImageReview}>
          <Avatar
            source={{
              uri: item.item.avatarUser
                ? item.item.avatarUser
                : "https://api.adorable.io/avatars/285/abott@adorable.png"
            }}
            size="large"
            rounded
            containerStyle={styles.containerAvataruserReview}
          />
        </View>
        <View style={styles.viewInfoReview}>
          <Text style={styles.titleReview}>{item.item.title}</Text>
          <Text style={styles.reviewText}>{item.item.review}</Text>
          <Rating imageSize={15} startingValue={item.item.rating} readonly />
          <Text style={styles.reviewDate}>
            {createReview.getDate()}/{createReview.getMonth() + 1}/{createReview.getFullYear()} -{" "}
            {createReview.getHours()}:{createReview.getMinutes()}
          </Text>
        </View>
      </View>
    );
  };

  render() {
    const { reviews, rating } = this.state;
    let { name, city, address, description, image } = this.props.navigation.state.params;
    const listInfoItem = [
      {
        text: `${address}, ${city}`,
        iconName: "map-marker",
        iconType: "material-community",
        action: null
      }
    ];
    return (
      <ScrollView style={styles.viewBody} indicatorStyle="white">
        <View style={styles.viewImage}>
          <Image
            source={{ uri: image }}
            PlaceholderContent={<ActivityIndicator />}
            style={styles.imageRestaurant}
          />
        </View>

        <View style={styles.viewContainerInfo}>
          <View style={styles.viewContainerNameRating}>
            <Text style={styles.nameRestaurant}>{name}</Text>
            <Rating style={styles.containerRating} imageSize={20} readonly startingValue={rating} />
          </View>
          <Text style={styles.descriptionRestaurant}>{description}</Text>
        </View>

        <View style={styles.viewListItems}>
          <Text style={styles.titleListItems}>Información sobre el restaurante</Text>
          {listInfoItem.map((item, index) => (
            <ListItem
              key={index}
              title={item.text}
              leftIcon={<Icon name={item.iconName} type={item.iconType} />}
            />
          ))}
        </View>

        <View style={styles.viewBtnReview}>
          <Button
            title="Añadir Comentario"
            onPress={() => this._goToScreenAddReview()}
            buttonStyle={styles.btnGoReview}
            disabled={!this._checkUserLogin()}
          />
        </View>
        <Text style={styles.textTitleReviews}>Comentarios</Text>
        {this._renderFlatList(reviews)}
        <Toast
          ref="toast"
          position="top"
          positionValue={10}
          fadeInDuration={1000}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{ color: "white" }}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  },
  viewImage: {
    width: "100%"
  },
  imageRestaurant: {
    width: "100%",
    height: 200,
    resizeMode: "cover"
  },
  viewContainerInfo: {
    margin: 15
  },
  nameRestaurant: {
    fontSize: 20,
    fontWeight: "bold"
  },
  descriptionRestaurant: {
    marginTop: 5,
    color: "gray"
  },
  viewListItems: {
    margin: 15,
    marginTop: 25
  },
  titleListItems: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  viewBtnReview: {
    margin: 20
  },
  btnGoReview: {
    backgroundColor: "#00a680"
  },
  viewStartLoadReview: {
    marginTop: 20,
    alignItems: "center"
  },
  viewRowReview: {
    flexDirection: "row",
    margin: 10,
    paddingBottom: 20,
    borderBottomColor: "#e3e3e3",
    borderBottomWidth: 1
  },
  viewRowImageReview: {
    marginRight: 15
  },
  containerAvataruserReview: {
    width: 50,
    height: 50
  },
  viewInfoReview: {
    flex: 1,
    alignItems: "flex-start"
  },
  titleReview: {
    fontWeight: "bold"
  },
  reviewText: {
    paddingTop: 2,
    color: "gray",
    marginBottom: 5
  },
  reviewDate: {
    marginTop: 5,
    color: "gray",
    fontSize: 12
  },
  textTitleReviews: {
    fontSize: 20,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
    fontWeight: "bold"
  },
  viewContainerNameRating: {
    flexDirection: "row"
  },
  containerRating: {
    position: "absolute",
    right: 0
  }
});
