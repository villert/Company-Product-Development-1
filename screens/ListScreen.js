// screens/ListScreen.js
import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { useTheme } from '../context/ThemeContext'

const MENUS = {
  Mara: [
    {
      category: 'Vegetarian Lunch',
      items: [
        { name: 'Black Bean Macaroni Casserole M, Mu, VEG, *, CONTAINS ORGANIC INGREDIENTS' },
        { name: 'Roasted Vegetables G, M, Mu, VEG, *' },
      ]
    },
    {
      category: 'Lunch',
      items: [
        { name: 'Cheesy Chicken Casserole G, L, Mu, *' },
        { name: 'Roasted Vegetables G, M, Mu, VEG, *' },
        { name: 'Carbonara Sauce G, L, Mu' },
        { name: 'Whole Grain Pasta M, Mu, VEG' },
        { name: 'Roasted Vegetables G, M, Mu, VEG, *' },
      ]
    },
    {
      category: 'Special Price Lunch',
      items: [
        { name: 'Pan-Fried Steak L' },
        { name: 'Garlic Potatoes G, L, Mu, *' },
        { name: 'Mushroom Sauce G, L, Mu, CONTAINS ORGANIC INGREDIENTS' },
      ]
    },
    {
      category: 'Dessert',
      items: [
        { name: 'Mango Quark G, L, Mu' },
      ]
    },
    {
      category: 'Salad and Soup',
      items: [
        { name: 'Chickpea Minestrone Soup G, M, Mu, VEG, *, CONTAINS ORGANIC INGREDIENTS' },
      ]
    },
  ],
  Julinia: [
    { category: 'Starters', items: [
      { name: 'Shrimp cocktail' },
      { name: 'Caesar salad' },
    ]},
    { category: 'Main Course', items: [
      { name: 'Grilled pike-perch' },
      { name: 'Rack of lamb' },
      { name: 'Pasta primavera' },
    ]},
    { category: 'Desserts', items: [
      { name: 'Creme brulee' },
      { name: 'Sorbet' },
    ]},
  ],
}

export default function ListScreen({ route }) {
  const { colors } = useTheme()
  const restaurantName = route?.params?.restaurantName

  if (!restaurantName) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.subText }]}>
          Select a restaurant from Home to see its menu.
        </Text>
      </View>
    )
  }

  const menu = MENUS[restaurantName]
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.headerText }]}>{restaurantName}</Text>
      {menu.map((section, sectionIndex) => (
        <View key={`${section.category}-${sectionIndex}`} style={[styles.section, { backgroundColor: colors.sectionBg }]}>
          <Text style={[styles.category, { color: colors.categoryText }]}>{section.category}</Text>
          {section.items.map((item, itemIndex) => (
            <View key={`${section.category}-${itemIndex}`} style={[styles.row, { borderBottomColor: colors.border }]}>
              <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyText: { fontSize: 16, textAlign: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 16, marginBottom: 20 },
  section: { borderRadius: 12, padding: 14, marginBottom: 12, elevation: 2 },
  category: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  row: { paddingVertical: 6, borderBottomWidth: 1 },
  itemName: { fontSize: 14 },
})