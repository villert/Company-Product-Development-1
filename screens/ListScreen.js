// screens/ListScreen.js
import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'

const MENUS = {
  Mara: [
    {
      category:{
        en:'Vegetarian Lunch',
        fi:'Kasvislounas'
      },
      items: [
        { name:{ 
          en: 'Black Bean Macaroni Casserole M, Mu, VEG, *, CONTAINS ORGANIC INGREDIENTS',
          fi: 'Mustapapumakaronilaatiokko M, Mu, VEG, *, Sisältää luomuaineksia'
          }
        },
        { name:{
          en: 'Roasted Vegetables G, M, Mu, VEG, *',
          fi: 'Paahdetut vihannekset G, M, Mu, VEG, *'
          } 
        },
      ]
    },
    {
      category:{
        en: 'Lunch',
        fi: 'Lounas'
      },
      items: [
        { name:{
          en: 'Cheesy Chicken Casserole G, L, Mu, *',
          fi: 'Juustoinen kanalaatikko G, L, Mu, *'
        }},
        { name:{
          en: 'Roasted Vegetables G, M, Mu, VEG, *',
          fi: 'Paahdetut vihannekset G, M, Mu, VEG, *'
        }},
        { name:{
          en: 'Carbonara Sauce G, L, Mu',
          fi: 'Carbonara-kastike G, L, Mu' 
        }},
        { name:{
          en: 'Whole Grain Pasta M, Mu, VEG',
          fi: 'Täysjyväpasta M, Mu, VEG' 
        }},
        { name:{
          en: 'Roasted Vegetables G, M, Mu, VEG, *',
          fi: 'Paahdetut vihannekset G, M, Mu, VEG, *' 
        }},
      ]
    },
    {
      category:{
        en: 'Special Price Lunch',
        fi: 'Erikoishintainen lounas'
      },
      items: [
        { name:{
          en: 'Pan-Fried Steak L',
          fi: 'Paistettu pihvi L' 
        }},
        { name:{
          en: 'Garlic Potatoes G, L, Mu, *',
          fi: 'Valkosipuli perunoita G, L, Mu, *' 
        }},
        { name:{
          en: 'Mushroom Sauce G, L, Mu, CONTAINS ORGANIC INGREDIENTS',
          fi: 'Sienikastike G, L, Mu, Sisältää luomuaineksia' 
        }},
      ]
    },
    {
      category:{
        en: 'Dessert',
        fi: 'Jälkiruoka'
      },
      items: [
        { name:{
          en: 'Mango Quark G, L, Mu',
          fi: 'Mango rahka G, L, Mu' 
        }},
      ]
    },
    {
      category:{
        en: 'Salad and Soup',
        fi: 'Salaatti ja keitto'
      },
      items: [
        { name:{
          en: 'Chickpea Minestrone Soup G, M, Mu, VEG, *, CONTAINS ORGANIC INGREDIENTS',
          fi: 'Kikherne-minestronekeitto G, M, Mu, VEG, *, Sisältää luomuaineksia'
        }},
      ]
    },
  ],
  Julinia: [
    { category:{
      en: 'Starters',
      fi: 'Alkuruoka'
    },
       items: [
      { name:{
        en: 'Shrimp cocktail',
        fi: 'Rapusalaatti'
      }},
      { name:{
        en: 'Caesar salad', 
        fi: 'Ceasar salaatti'
      }},
    ]},
    { category:{
      en: 'Main Course',
      fi: 'Pääruoka'
    }, 
      items: [
      { name:{
        en: 'Grilled pike-perch',
        fi: 'Grillattu kuha'
      }},
      { name:{
        en: 'Rack of lamb',
        fi: 'Lampaankare'
      }},
      { name:{
        en: 'Pasta primavera',
        fi: 'Pasta vihannestenkanssa'
      }},
    ]},
    { category:{
      en: 'Desserts',
      fi: 'Jälkiruoka'
    }, 
      items: [
      { name:{
        en: 'Creme brulee',
        fi: 'Creme brulee'
      }},
      { name:{
        en: 'Sorbet',
        fi: 'Sorpetti' 
      }},
    ]},
  ],
}

export default function ListScreen({ route }) {
  const {t, language} = useLanguage()
  const { colors } = useTheme()
  const restaurantName = route?.params?.restaurantName

  if (!restaurantName) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.subText }]}>{t('selectRestaurant')}</Text>
      </View>
    )
  }

  const menu = MENUS[restaurantName]
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.headerText }]}>{restaurantName}</Text>
      {menu.map((section, sectionIndex) => (
        <View key={`${section.category}-${sectionIndex}`} style={[styles.section, { backgroundColor: colors.sectionBg }]}>
          <Text style={[styles.category, { color: colors.categoryText }]}>{section.category[language]}</Text>
          {section.items.map((item, itemIndex) => (
            <View key={`${section.category}-${itemIndex}`} style={[styles.row, { borderBottomColor: colors.border }]}>
              <Text style={[styles.itemName, { color: colors.text }]}>{item.name[language]}</Text>
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