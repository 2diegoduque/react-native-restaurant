import React from "react";
import { View, StyleSheet } from "react-native";
import { Input, Icon } from "react-native-elements";

export default (inputTemplate = locals => {
  return (
    <View style={styles.viewContainer}>
      <Input
        placeholder={locals.config.placeholder}
        shake={true}
        // errorMessage={locals.config.errorMessage}
        // errorStyle={{ color: "red" }}
        password={locals.config.password}
        secureTextEntry={locals.config.secureTextEntry}
        rightIcon={
          <Icon
            type={locals.config.iconType}
            color="#b3b3b3"
            size={24}
            name={locals.config.iconName}
          />
        }
        onChangeText={value => locals.onChange(value)}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  viewContainer: {
    marginTop: 12,
    marginBottom: 12
  }
});
