import { View, Text } from "react-native"
import Themes from "./themes/Themes"

export default function HomeScreen() {
  return (
    <View style={Themes.centeredContainer}>
      <Text style={Themes.centeredText}>Home</Text>
    </View>
  )
}