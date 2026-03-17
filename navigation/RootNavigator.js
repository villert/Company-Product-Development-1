// navigation/RootNavigator.js
import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import BottomTabs from "./BottomTabs"
import ChatScreen from "../screens/ChatScreen"
import SettingsScreen from "../screens/SettingsScreen"
import Auth from "../screens/Auth"

const Stack = createNativeStackNavigator()

export default function RootNavigator() {
  return (
   <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Auth">
  <Stack.Screen name="Auth" component={Auth} />
  <Stack.Screen name="Tabs" component={BottomTabs} />
  <Stack.Screen name="Chat" component={ChatScreen} />
  <Stack.Screen name="Settings" component={SettingsScreen} />
</Stack.Navigator>
  )
}