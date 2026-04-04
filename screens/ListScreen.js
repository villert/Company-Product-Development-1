// screens/ListScreen.js
import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import { fetchMenu } from '../firestoreController'

export default function ListScreen({ route }) {
  const { t, language } = useLanguage()
  const { colors } = useTheme()
  const restaurantName = route?.params?.restaurantName

  const [menu, setMenu] = useState(null)

  useEffect(() => {
    if (!restaurantName) return

    const loadMenu = async () => {
      const data = await fetchMenu(restaurantName)
      setMenu(data)
    }

    loadMenu()
  }, [restaurantName])

  if (!restaurantName) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.subText }]}>
          {t('selectRestaurant')}
        </Text>
      </View>
    )
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.headerText }]}>
        {restaurantName}
      </Text>

      {menu ? (
        menu.map((section, sectionIndex) => (
          <View
            key={`${section.category.en}-${sectionIndex}`}
            style={[styles.section, { backgroundColor: colors.sectionBg }]}
          >
            <Text style={[styles.category, { color: colors.categoryText }]}>
              {section.category[language]}
            </Text>

            {section.items.map((item, itemIndex) => (
              <View
                key={`${section.category.en}-${itemIndex}`}
                style={[styles.row, { borderBottomColor: colors.border }]}
              >
                <Text style={[styles.itemName, { color: colors.text }]}>
                  {item.name[language]}
                </Text>
              </View>
            ))}
          </View>
        ))
      ) : (
        <Text style={{ color: colors.text, textAlign: 'center', marginTop: 20 }}>
          Loading...
        </Text>
      )}
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