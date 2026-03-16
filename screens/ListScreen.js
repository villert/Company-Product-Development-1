import { View, Text } from "react-native"
import Themes from "../themes/Themes"

export default function ListScreen() {
  return (
    <View style={Themes.centeredContainer}>
      <Text style={Themes.centeredText}>List</Text>
    </View>
  )
}