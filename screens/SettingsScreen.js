import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { SafeAreaView } from "react-native-safe-area-context"
import Themes from "../themes/Themes"

export default function SettingsScreen() {
  const navigation = useNavigation()

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Content */}
      <View style={Themes.centeredContainer}>
        <Text style={Themes.centeredText}>This is Settings</Text>
      </View>
    </SafeAreaView>
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
  backBtn: { fontSize: 16, color: "#333", fontWeight: "600" },
  title: { fontSize: 18, fontWeight: "600" },
})