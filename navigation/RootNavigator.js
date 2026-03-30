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
  const { colors, isDark } = useTheme()
  const {t} = useLanguage()
  return (
    <SafeAreaView style={{ backgroundColor: colors.header }}>
      <View style={[styles.header, { backgroundColor: colors.header }]}>
        {/* This button opens the chat screen. */}
        {/* Chat is not shown as a normal bottom tab, so we reach it from the header instead. */}
        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Text style={[styles.headerBtn, { color: colors.headerText }]}>{t('chat')}</Text>
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image
            source={isDark ? require("../assets/Foodi_logo_white.png") : require("../assets/Foodi_logo.png")}
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
  const { t } = useLanguage()
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* The custom header is shown above the tabs on every main screen. */}
      <AppHeader navigation={navigation} />
      <Tab.Navigator
        initialRouteName="Home"
        detachInactiveScreens
        screenOptions={({ route }) => ({
          // These settings help performance by doing less work for tabs that are not open right now.
          lazy: true,
          freezeOnBlur: true,
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
        <Tab.Screen
          name="List"
          component={ListScreen}
          initialParams={{ restaurantName: null }}
          // The List screen can open normally, or another screen can send it a restaurant name.
          options={{ tabBarLabel: t("list") }}
        />
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ tabBarLabel: t("home") }}
        />
        <Tab.Screen
          name="Map"
          component={MapScreen}
          // Rebuilding the map screen on revisit helps clear old temporary map state.
          options={{ tabBarLabel: t("map"), unmountOnBlur: true }}
        />
      </Tab.Navigator>
    </View>
  )
}

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* This stack controls the top-level app flow. */}
      {/* The user starts at Auth, then moves into Tabs, and can also open Chat or Settings. */}
      <Stack.Screen name="Auth" component={Auth} />
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="Chat" component={ChatScreen} />
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
