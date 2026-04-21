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
  const [loading, setLoading] = useState(true)
  const [day, setDay] = useState(
    new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
  )

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday"]

  useEffect(() => {
    if (!restaurantName) return

    setLoading(true)
    fetchMenu(restaurantName, day, language).then((data) => {
      setMenu(data)
      setLoading(false)
    })
  }, [restaurantName, day])

  if (!restaurantName) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.subText }}>
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


      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {days.map((d) => (
          <Text
            key={d}
            onPress={() => setDay(d)}
            style={{
              padding: 10,
              marginRight: 8,
              borderRadius: 20,
              backgroundColor: d === day ? colors.headerText : colors.sectionBg,
              color: d === day ? colors.background : colors.text,
            }}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </Text>
        ))}
      </ScrollView>

      {loading && <Text style={styles.centerText}>Loading...</Text>}

      {!loading && !menu && (
        <Text style={styles.centerText}>No menu available</Text>
      )}

      {!loading && menu && menu.map((section, i) => (
        <View key={i} style={[styles.section, { backgroundColor: colors.sectionBg }]}>
          <Text style={{ color: colors.categoryText, fontWeight: 'bold' }}>
            {section.category[language]}
          </Text>

          {section.items.map((item, j) => (
            <Text key={j} style={{ color: colors.text }}>
              {item.name[language]}
            </Text>
          ))}
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  section: { borderRadius: 12, padding: 14, marginTop: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centerText: { textAlign: 'center', marginTop: 20 },
})