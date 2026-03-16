import React from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Ionicons } from "@expo/vector-icons"
import HomeScreen from "../screens/HomeScreen"
import ListScreen from "../screens/ListScreen"
import MapScreen from "../screens/MapScreen"
import ChatScreen from "../screens/ChatScreen"
import SettingsScreen from "../screens/SettingsScreen"

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

function AppHeader({ navigation }) {
  return (
    <SafeAreaView style={{ backgroundColor: "#8dc9a4" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Text style={styles.headerBtn}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Text style={styles.headerBtn}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

function TabNavigator({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <AppHeader navigation={navigation} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let icon
            if (route.name === "List") icon = "list"
            if (route.name === "Home") icon = "home"
            if (route.name === "Map") icon = "map"
            return <Ionicons name={icon} size={size} color={color} />
          },
          tabBarActiveTintColor: "blue",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: "#8dc9a4",
            borderTopWidth: 0,
            height: 60,
          },
        })}
      >
        <Tab.Screen name="List" component={ListScreen} />
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            tabBarButton: () => null,
            tabBarItemStyle: { display: "none" }
          }}
        />
      </Tab.Navigator>
    </View>
  )
}

export default function BottomTabs() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 48,
    backgroundColor: "#8dc9a4",
  },
  headerBtn: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
})