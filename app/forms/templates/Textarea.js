import React from "react";
import { View, StyleSheet } from "react-native";
import { Input } from "react-native-elements";

export default (TextareaTemplate = locals => {
  return (
    <View style={styles.viewContainer}>
      <Input
        inputContainerStyle={styles.inputContainer}
        placeholder={locals.config.placeholder}
        multiline={true}
        onChangeText={value => locals.onChange(value)}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  viewContainer: {
    margin: 12,
    width: "100%",
    height: 100
  },
  inputContainer: {
    position: "absolute",
    width: "100%",
    height: 100,
    padding: 0,
    margin: 0
  }
});
