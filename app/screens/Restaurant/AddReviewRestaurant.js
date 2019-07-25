import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { AirbnbRating, Button, Overlay } from "react-native-elements";
import Toast from "react-native-easy-toast";
import t from "tcomb-form-native";
const Form = t.form.Form;
import {
  AddReviewRestaurantStruct,
  AddReviewRestaurantOptions
} from "../../forms/AddReviewRestaurant";

import firebaseApp from "../../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default class AddReviewRestaurant extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      formData: {
        title: "",
        review: ""
      }
    };
  }

  _onChangeFormRating = formData => {};

  _sendReview = () => {
    let ratingValue = this.refs.rating.state.position;
    if (!ratingValue) {
      this.refs.toast.show("Debes seleccionar la cantidad de estrellas", 1700);
    } else {
      let validateForm = this.refs.ratingForm.getValue();
      if (!validateForm) {
        this.refs.toast.show("Debes ingresar todos los campos del formulario", 1700);
      } else {
        this.setState({
          loading: true
        });
        let user = firebase.auth().currentUser;
        let data = {
          idUser: user.uid,
          avatarUser: user.photoURL,
          idRestaurante: this.props.navigation.state.params.id,
          title: validateForm.title,
          review: validateForm.review,
          rating: ratingValue,
          createAt: new Date()
        };
        db.collection("review")
          .add(data)
          .then(() => {
            let restaurantRef = db
              .collection("restaurants")
              .doc(this.props.navigation.state.params.id);

            restaurantRef.get().then(resolve => {
              let ratingTotal = resolve.data().ratingTotal + ratingValue;
              let quantityVoting = resolve.data().quantityVoting + 1;
              let rating = ratingTotal / quantityVoting;
              restaurantRef.update({ rating, ratingTotal, quantityVoting }).then(() => {
                this.setState({
                  loading: false
                });
                this.refs.toast.show("Comentario enviado correctamente", 100, () => {
                  this.props.navigation.state.params.reloadReviews();
                  this.props.navigation.goBack();
                });
              });
            });
          })
          .catch(error => {
            this.setState({
              loading: false
            });
            this.refs.toast.show("Error al enviar comentario, intente mas tarde", 1700);
          });
      }
    }
  };

  render() {
    return (
      <View style={styles.viewBody}>
        <View style={styles.viewRating}>
          <AirbnbRating
            ref="rating"
            count={5}
            reviews={["Pésimo", "Deficiente", "Normal", "Muy Bueno", "Excelente"]}
            defaultRating={0}
            size={35}
          />
        </View>
        <View style={styles.formRating}>
          <Form
            ref="ratingForm"
            type={AddReviewRestaurantStruct}
            options={AddReviewRestaurantOptions}
            value={this.state.formData}
            onChange={formValue => this._onChangeFormRating(formValue)}
          />
        </View>

        <View style={styles.viewSendReview}>
          <Button
            title="Enviar comentario"
            buttonStyle={styles.btnSendReview}
            onPress={() => this._sendReview()}
          />
        </View>
        <Overlay
          overlayStyle={styles.overlayLoading}
          isVisible={this.state.loading}
          width="auto"
          height="auto"
        >
          <Text style={styles.textOverlay}>Enviando comentario</Text>
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
  viewRating: {
    height: 110,
    backgroundColor: "#f2f2f2"
  },
  formRating: {
    margin: 10,
    marginTop: 40
  },
  viewSendReview: {
    flex: 1,
    justifyContent: "flex-end",
    margin: 30
  },
  btnSendReview: {
    backgroundColor: "#00a680"
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
