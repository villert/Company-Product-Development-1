import React from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Ionicons } from "@expo/vector-icons"
import HomeScreen from "../screens/HomeScreen"
import ListScreen from "../screens/ListScreen"
import MapScreen from "../screens/MapScreen"
import ChatScreen from "../screens/ChatScreen"
import SettingsScreen from "../screens/SettingsScreen"
import Auth from "../screens/Auth"
import { useTheme } from "../context/ThemeContext"
import { useLanguage } from "../context/LanguageContext"

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

function AppHeader({ navigation }) {
  const { colors } = useTheme()
  const {t} = useLanguage()
  return (
    <SafeAreaView style={{ backgroundColor: colors.header }}>
      <View style={[styles.header, { backgroundColor: colors.header }]}>
        {/* This button opens the chat screen. */}
        {/* Chat exists in navigation, but we hide it from the bottom tab bar. */}
        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Text style={[styles.headerBtn, { color: colors.headerText }]}>{t('chat')}</Text>
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/Foodi_logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Text style={[styles.headerBtn, { color: colors.headerText }]}>{t('settings')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

function TabNavigator({ navigation }) {
  const { colors } = useTheme()
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* The custom header stays above the bottom tabs. */}
      <AppHeader navigation={navigation} />
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          // Every tab can have its own icon.
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let icon
            if (route.name === "List") icon = "list"
            if (route.name === "Home") icon = "home"
            if (route.name === "Map") icon = "map"
            return <Ionicons name={icon} size={size} color={color} />
          },
          tabBarActiveTintColor: colors.categoryText,
          tabBarInactiveTintColor: colors.hint,
          tabBarStyle: {
            backgroundColor: colors.tabBar,
            borderTopColor: colors.tabBarBorder,
            borderTopWidth: 1,
            height: 100,
          },
          tabBarLabelStyle: {
            color: colors.text,
          },
        })}
      >
        {/* The List screen can be opened without choosing a restaurant first. */}
        <Tab.Screen name="List" component={ListScreen} initialParams={{ restaurantName: null }} />
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            // This keeps Chat available for navigation, but removes its button from the tab bar.
            tabBarButton: () => null,
            tabBarItemStyle: { display: "none" },
          }}
        />
      </Tab.Navigator>
    </View>
  )
}

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* This stack decides the main flow of the app. */}
      {/* First the user sees Auth, and after that they move into the tab-based part of the app. */}
      <Stack.Screen name="Auth" component={Auth} />
      <Stack.Screen name="Tabs" component={TabNavigator} />
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
    position: "relative",
  },
  headerBtn: {
    fontSize: 16,
    fontWeight: "600",
    width: 80,
  },
  logoContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 50,
  },
})
