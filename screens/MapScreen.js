import { View, Text } from "react-native"
import Themes from "./themes/Themes"

export default function MapScreen() {
  return (
    <View style={Themes.centeredContainer}>
      <Text style={Themes.centeredText}>Map</Text>
    </View>
  )
}