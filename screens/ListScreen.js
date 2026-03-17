import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'

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
      { name: 'Shrimp cocktail'},
      { name: 'Caesar salad'},
    ]},
    { category: 'Main Course', items: [
      { name: 'Grilled pike-perch'},
      { name: 'Rack of lamb'},
      { name: 'Pasta primavera'},
    ]},
    { category: 'Desserts', items: [
      { name: 'Creme brulee'},
      { name: 'Sorbet'},
    ]},
  ],
}

export default function ListScreen({ route }) {
  const restaurantName = route?.params?.restaurantName

  if (!restaurantName) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Select a restaurant from Home to see its menu.</Text>
      </View>
    )
  }

  const menu = MENUS[restaurantName]

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{restaurantName}</Text>
      {menu.map((section, sectionIndex) => (
        <View key={`${section.category}-${sectionIndex}`} style={styles.section}>
          <Text style={styles.category}>{section.category}</Text>
          {section.items.map((item, itemIndex) => (
            <View key={`${section.category}-${itemIndex}`} style={styles.row}>
              <Text style={styles.itemName}>{item.name}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#d6f9df', padding: 16 },
  emptyContainer: { flex: 1, backgroundColor: '#d6f9df', justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyText: { fontSize: 16, color: '#555', textAlign: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#1a3a1a', textAlign: 'center', marginTop: 16, marginBottom: 20 },
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, elevation: 2 },
  category: { fontSize: 16, fontWeight: 'bold', color: '#2e7d32', marginBottom: 10 },
  row: { paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  itemName: { fontSize: 14, color: '#222' },
})