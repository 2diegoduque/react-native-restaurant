import React, { Component } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { Icon, Image, Button, Text, Overlay } from "react-native-elements";
import t from "tcomb-form-native";
const Form = t.form.Form;
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import Toast from "react-native-easy-toast";
import { AddRestaurantStruct, AddRestaurantOptions } from "../../forms/AddRestaurant";

import { UploadImages } from "../../utils/UploadImages";
import firebaseApp from "../../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default class AddRestaurant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      imageUriRestaurant: "",
      formData: {
        name: "",
        city: "",
        address: "",
        description: ""
      }
    };
  }

  isImageRestaurant = image => {
    return image ? (
      <Image source={{ uri: image }} style={{ width: 500, height: 200 }} resizeMode="stretch" />
    ) : (
      <Image
        source={require("../../../assets/img/no-image.png")}
        style={{ width: 200, height: 200 }}
      />
    );
  };

  uploadImage = async () => {
    const resultPermissions = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (resultPermissions.status === "denied") {
      this.refs.toast.show("No has dados permisos para acceder a tu galeria", 1700);
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true
      });
      if (result.cancelled) {
        this.refs.toast.show("Has cerrado la galeria, sin seleccionar una imagen", 1700);
      } else {
        this.setState({
          imageUriRestaurant: result.uri
        });
      }
    }
  };

  onChangeFormAddRestaurant = formData => {
    this.setState({
      formData
    });
  };

  createRestaurant = () => {
    const imageUriRestaurant = this.state.imageUriRestaurant;
    const { name, city, address, description } = this.state.formData;

    if (imageUriRestaurant && name && city && address && description) {
      this.setState({
        loading: true
      });
      const data = {
        name,
        city,
        address,
        description,
        image: "",
        createAt: new Date()
      };
      db.collection("restaurants")
        .add(data)
        .then(dataRestaurant => {
          UploadImages(imageUriRestaurant, dataRestaurant.id, "restaurants")
            .then(imageUrl => {
              const restaurantRef = db.collection("restaurants").doc(dataRestaurant.id);
              restaurantRef
                .update({ image: imageUrl })
                .then(() => {
                  this.setState({
                    loading: false
                  });
                  this.props.navigation.state.params.loadRestaurant();
                  this.props.navigation.goBack();
                })
                .catch(error => {
                  this.setState({
                    loading: false
                  });
                  console.log("error update image: ", error);
                  this.refs.toast.show("Error al actualizar image, intenta mas tarde", 1700);
                });
            })
            .catch(error => {
              this.setState({
                loading: false
              });
              console.log("error UploadImages: ", error);
              this.refs.toast.show("Error al cargar imagen, intenta mas tarde", 1700);
            });
        })
        .catch(error => {
          this.setState({
            loading: false
          });
          console.log("error db.colletion", error);
          this.refs.toast.show("Error al crear restaurante, intenta mas tarde", 1700);
        });
    } else {
      this.refs.toast.show("Debes diligenciar todos los campos", 1700);
    }
  };

  render() {
    const { imageUriRestaurant, loading } = this.state;
    return (
      <View style={styles.viewBody}>
        <View style={styles.viewPhoto}>{this.isImageRestaurant(imageUriRestaurant)}</View>
        <View>
          <Form
            ref="addRestaurantForm"
            type={AddRestaurantStruct}
            options={AddRestaurantOptions}
            value={this.state.formData}
            onChange={formValue => this.onChangeFormAddRestaurant(formValue)}
          />
        </View>
        <View style={styles.viewIconUploadImage}>
          <Icon
            name="camera"
            type="material-community"
            color="#7a7a7a"
            iconStyle={styles.addPhotoIcon}
            onPress={() => this.uploadImage()}
          />
        </View>
        <View style={styles.viewButton}>
          <Button
            title="Crear Restaurante"
            onPress={() => this.createRestaurant()}
            buttonStyle={styles.btnAddRestaurant}
          />
        </View>
        <Overlay
          overlayStyle={styles.overlayLoading}
          isVisible={loading}
          width="auto"
          height="auto"
        >
          <Text style={styles.textOverlay}>Creando Restaurante</Text>
          <ActivityIndicator size="large" color="#00a680" />
        </Overlay>
        <Toast
          ref="toast"
          position="top"
          positionValue={10}
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
  viewBody: {
    flex: 1
  },
  viewPhoto: {
    alignItems: "center",
    height: 200,
    marginBottom: 20
  },
  viewIconUploadImage: {
    // flex: 1,
    // alignItems: "flex-start",
    // marginLeft: 12
    marginTop: 15
  },
  // addPhotoIcon: {
  //   backgroundColor: "#e3e3e3",
  //   padding: 17,
  //   margin: 0
  // }
  viewButton: {
    // flex: 1,
    // alignItems: "flex-end",
  },
  btnAddRestaurant: {
    backgroundColor: "#00a680",
    margin: 20
  },
  overlayLoading: {
    padding: 20
  },
  textOverlay: {
    color: "#00a680",
    marginBottom: 20,
    fontSize: 20
  }
});
