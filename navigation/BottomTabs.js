import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"

import HomeScreen from "../screens/HomeScreen"
import ListScreen from "../screens/ListScreen"
import MapScreen from "../screens/MapScreen"

const Tab = createBottomTabNavigator()

export default function BottomTabs() {
  return (

    //Tällä luodaan se järjestys missä ne tabit näkyy, ja määritellään niille ikonit.
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let icon

          if (route.name === "List") {
            icon = "list"
          }

          if (route.name === "Home") {
            icon = "home"
          }

          if (route.name === "Map") {
            icon = "map"
          }

          return <Ionicons name={icon} size={size} color={color} />
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray"
      })}
      

    >

      <Tab.Screen name="List" component={ListScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
    </Tab.Navigator>
  )
}