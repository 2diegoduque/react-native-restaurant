import * as firebase from "firebase";

export const UploadImages = async (uri, nameImage, folder) => {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.onerror = reject;
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        resolve(xhr.response);
      }
    };

    xhr.open("GET", uri);
    xhr.responseType = "blob";
    xhr.send();
  }).then(async resolve => {
    const res = firebase
      .storage()
      .ref()
      .child(`${folder}/${nameImage}`);
    await res.put(resolve);

    return await firebase
      .storage()
      .ref(`${folder}/${nameImage}`)
      .getDownloadURL()
      .then(resolve => {
        return resolve;
      })
      .catch(error => {
        console.log("error UploadImage: ", error);
      });
  });
};
