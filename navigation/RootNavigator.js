// navigation/RootNavigator.js
import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import BottomTabs from "./BottomTabs"
import ChatScreen from "../screens/ChatScreen"
import SettingsScreen from "../screens/SettingsScreen"

const Stack = createNativeStackNavigator()

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main bottom tabs */}
      <Stack.Screen name="Tabs" component={BottomTabs} />

      {/* Screens accessible from top header */}
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  )
}