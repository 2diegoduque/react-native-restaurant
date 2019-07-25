import React from "react";
import {
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer
} from "react-navigation";

import { Icon } from "react-native-elements";

import TopFiveScreen from "../screens/TopFive";
import SearchScreen from "../screens/Search";

// screen Account
import AccountScreen from "../screens/Account/Account";
import RegisterScreen from "../screens/Account/Register";
import LoginScreen from "../screens/Account/Login";

// Screen Restaurant
import HomeScreen from "../screens/Restaurant/Home";
import AddRestaurantScreen from "../screens/Restaurant/AddRestaurant";
import DetailRestaurantScreen from "../screens/Restaurant/DetailRestaurant";
import AddReviewRestaurant from "../screens/Restaurant/AddReviewRestaurant";

const homeScreenStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Home"
    })
  },
  AddRestaurant: {
    screen: AddRestaurantScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Nuevo restaurante"
    })
  },
  DetailRestaurant: {
    screen: DetailRestaurantScreen,
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params.name
    })
  },
  AddReviewRestaurant: {
    screen: AddReviewRestaurant,
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params.name
    })
  }
});

const topFiveScreenStack = createStackNavigator({
  TopFive: {
    screen: TopFiveScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Top Five"
    })
  },
  DetailRestaurant: {
    screen: DetailRestaurantScreen,
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params.name
    })
  }
});

const searchScreenStack = createStackNavigator({
  Search: {
    screen: SearchScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Buscar"
    })
  }
});

const accountScreenStack = createStackNavigator({
  Account: {
    screen: AccountScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Mi Cuenta"
    })
  },
  Register: {
    screen: RegisterScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Registro"
    })
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Login"
    })
  }
});

const RootStack = createBottomTabNavigator(
  {
    Home: {
      screen: homeScreenStack,
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: "Home",
        tabBarIcon: ({ tintColor }) => <Icon name="home" type="octicon" color={tintColor} />
      })
    },
    TopFive: {
      screen: topFiveScreenStack,
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: "Top 5",
        tabBarIcon: ({ tintColor }) => <Icon name="bookmark" type="octicon" color={tintColor} />
      })
    },
    Search: {
      screen: searchScreenStack,
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: "Buscar",
        tabBarIcon: ({ tintColor }) => <Icon name="search" type="octicon" color={tintColor} />
      })
    },
    Account: {
      screen: accountScreenStack,
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: "Mi Cuenta",
        tabBarIcon: ({ tintColor }) => <Icon name="person" type="octicon" color={tintColor} />
      })
    }
  },
  {
    initialRouteName: "Home",
    order: ["Home", "TopFive", "Search", "Account"],
    tabBarOptions: {
      inactiveTintColor: "#646464",
      activeTintColor: "#00a680"
    }
  }
);

export default createAppContainer(RootStack);
