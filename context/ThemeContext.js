// context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ThemeContext = createContext()

export const COLORS = {
  light: {
    background: '#d6f9df',
    card: '#ffffff',
    header: '#8dc9a4',
    headerText: '#1a3a1a',
    text: '#222222',
    subText: '#555555',
    hint: '#999999',
    border: '#cccccc',
    myBubble: '#8dc9a4',
    theirBubble: '#b2ecc0',
    inputBg: '#ffffff',
    categoryText: '#2e7d32',
    sectionBg: '#ffffff',
    tabBar: '#ffffff',
    tabBarBorder: '#cccccc',
  },
  dark: {
    background: '#121212',
    card: '#1e1e1e',
    header: '#1e1e1e',
    headerText: '#a5d6b0',
    text: '#eeeeee',
    subText: '#aaaaaa',
    hint: '#666666',
    border: '#333333',
    myBubble: '#2e6b4f',
    theirBubble: '#2a2a2a',
    inputBg: '#1e1e1e',
    categoryText: '#6fcf8e',
    sectionBg: '#1e1e1e',
    tabBar: '#1a1a1a',
    tabBarBorder: '#333333',
  },
}

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false)

  // Load saved preference on startup
  useEffect(() => {
    AsyncStorage.getItem('darkMode').then(value => {
      if (value === 'true') setIsDark(true)
    })
  }, [])

  const toggleTheme = async () => {
    const next = !isDark
    setIsDark(next)
    await AsyncStorage.setItem('darkMode', String(next))
  }

  const colors = isDark ? COLORS.dark : COLORS.light

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}