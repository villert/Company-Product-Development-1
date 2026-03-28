// App.js
import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import RootNavigator from "./navigation/RootNavigator"
import { ThemeProvider } from "./context/ThemeContext"
import { LanguageProvider } from "./context/LanguageContext"

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </LanguageProvider>
    </ThemeProvider>
  )
}