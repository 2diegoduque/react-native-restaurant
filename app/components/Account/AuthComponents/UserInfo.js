import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Avatar, Button } from "react-native-elements";
import * as firebase from "firebase";
import UpdateUserInfo from "./updateUserInfo";
import Toast from "react-native-easy-toast";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default class UserInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props,
      infoUser: {
        displayName: "",
        email: "",
        phoneNumber: "",
        photoURL: "",
        providerId: "",
        uid: ""
      }
    };
    console.log(this.state.logOut);
  }

  componentDidMount = async () => {
    await this.getUserInfo();
  };

  getUserInfo = async () => {
    const user = firebase.auth().currentUser;
    user.providerData.forEach(infoUser => {
      this.setState({
        infoUser
      });
    });
  };

  checkAvataUser = avatarUrl => {
    return avatarUrl ? avatarUrl : "https://api.adorable.io/avatars/285/abott@adorable.png";
  };

  updateUserDisplayName = newDisplayName => {
    firebase
      .auth()
      .currentUser.updateProfile({ displayName: newDisplayName })
      .then(() => {
        this.setState({
          infoUser: {
            ...this.state.infoUser,
            displayName: newDisplayName
          }
        });
      });
  };

  updateUserPhoto = photoUrl => {
    firebase
      .auth()
      .currentUser.updateProfile({ photoURL: photoUrl })
      .then(() => {
        this.setState({
          infoUser: {
            ...this.state.infoUser,
            photoURL: photoUrl
          }
        });
      });
  };

  refreshAuth = currentPassword => {
    const user = firebase.auth().currentUser;
    const credentials = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
    return user.reauthenticateWithCredential(credentials);
  };

  updateUserEmail = (newEmail, password) => {
    this.refreshAuth(password)
      .then(() => {
        const user = firebase.auth().currentUser;
        user
          .updateEmail(newEmail)
          .then(() => {
            this.refs.toast.show("Cambio exitoso, inicia sesión", 1000);
            firebase.auth().signOut();
          })
          .catch(error => {
            this.refs.toast.show("Error al actualizar Correo Electrónico", 1000);
          });
      })
      .catch(error => {
        this.refs.toast.show("Contraseña incorrecta", 1000);
      });
  };

  updateUserPassword = (password, newPassword) => {
    this.refreshAuth(password)
      .then(() => {
        const user = firebase.auth().currentUser;
        user
          .updatePassword(newPassword)
          .then(() => {
            this.refs.toast.show("Cambio exitoso, inicia sesión", 50, () => {
              firebase.auth().signOut();
            });
          })
          .catch(error => {
            this.refs.toast.show("Error al actualizar contraseña, intenta mas tarde", 1700);
          });
      })
      .catch(error => {
        this.refs.toast.show("Contraseña actual incorrecta", 1000);
      });
  };

  validateStateUserInfo = infoUserData => {
    if (infoUserData.uid != "") {
      return (
        <UpdateUserInfo
          infoUser={this.state.infoUser}
          updateUserDisplayName={this.updateUserDisplayName}
          updateUserEmail={this.updateUserEmail}
          updateUserPassword={this.updateUserPassword}
        />
      );
    }
  };

  changeAvatarUser = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status == "denied") {
      alert("Es necesario aceptar los permisos para poder cambiar la imagen.");
    } else {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3]
      });
      if (result.cancelled) {
        this.refs.toast.show("Has cerrado la galeria, sin seleccionar una imagen", 1700);
      } else {
        this.uploadImage(result.uri, this.state.infoUser.uid, "")
          .then(() => {
            this.refs.toast.show("Avatar actualizado correctamente", 1500);
            firebase
              .storage()
              .ref("avatar/" + this.state.infoUser.uid)
              .getDownloadURL()
              .then(resolve => {
                this.updateUserPhoto(resolve);
              })
              .catch(error => {
                console.log("error: ", error);
                this.refs.toast.show("Error al recuperar avatar del servidor", 1700);
              });
          })
          .catch(error => {
            console.log("error: ", error);
            this.refs.toast.show("Error al actualizar avatar, intenta mas tarde", 1700);
          });
      }
    }
  };

  uploadImage = async (uri, nameImage, progressCallback) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    var metadata = {
      contentType: "image/jpeg"
    };

    const ref = firebase
      .storage()
      .ref()
      .child("avatar/" + nameImage);

    const task = ref.put(blob, metadata);

    return new Promise((resolve, reject) => {
      task.on(
        "state_changed",
        snapshot => {
          progressCallback && progressCallback(snapshot.bytesTransferred / snapshot.totalBytes);
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log("Upload is " + progress + "% done");
          if (progress == 100) {
            resolve();
          }
        },
        error => reject(error)
      );
    });
  };

  render() {
    return (
      <View>
        <View style={styles.viewBody}>
          <Avatar
            size="large"
            rounded
            source={{
              uri: this.checkAvataUser(this.state.infoUser.photoURL)
            }}
            containerStyle={styles.avatarUser}
            showEditButton
            onEditPress={() => this.changeAvatarUser()}
          />
          <View>
            <Text style={styles.displayName}>{this.state.infoUser.displayName}</Text>
            <Text>{this.state.infoUser.email}</Text>
          </View>
        </View>
        {this.validateStateUserInfo(this.state.infoUser)}
        <Button
          title="Cerrar Sesión"
          onPress={() => this.state.logOut()}
          buttonStyle={styles.btnLogOut}
          titleStyle={styles.btnLogOutText}
        />
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
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingTop: 30,
    paddingBottom: 30,
    backgroundColor: "#f2f2f2"
  },
  avatarUser: {
    marginRight: 20
  },
  displayName: {
    fontWeight: "bold"
  },
  btnLogOut: {
    marginTop: 30,
    borderRadius: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e3e3e3",
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3e3",
    paddingTop: 13,
    paddingBottom: 13
  },
  btnLogOutText: {
    color: "#00a680"
  }
});
