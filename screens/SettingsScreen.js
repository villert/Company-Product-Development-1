// screens/SettingsScreen.js
import React, { useEffect, useState } from "react"
import {
  View, Text, TouchableOpacity, StyleSheet,
  TextInput, ActivityIndicator, Alert, Switch
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { SafeAreaView } from "react-native-safe-area-context"
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore"
import { getAuth, signOut } from "firebase/auth"
import { firebaseApp } from "../firebase"
import { useTheme } from "../context/ThemeContext"
import { useLanguage } from "../context/LanguageContext"

const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

function Avatar({ name, size = 84 }) {
  const initials = name
    ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "?"
  const colors = ["#f28b82", "#fbbc04", "#34a853", "#4285f4", "#a142f4", "#ff6d00", "#00bcd4"]
  const colorIndex = name
    ? name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length
    : 0

  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: colors[colorIndex],
      alignItems: "center", justifyContent: "center"
    }}>
      <Text style={{ color: "#fff", fontWeight: "bold", fontSize: size * 0.38 }}>
        {initials}
      </Text>
    </View>
  )
}

export default function SettingsScreen() {
  const navigation = useNavigation()
  const { colors, isDark, toggleTheme } = useTheme()
  const [name, setName] = useState("")
  const [editingName, setEditingName] = useState(false)
  const [draftName, setDraftName] = useState("")
  const [saving, setSaving] = useState(false)
  const { language, toggleLanguage, t } = useLanguage()
  const isFinnish = language === "fi"

  const uid = auth.currentUser?.isAnonymous ? null : auth.currentUser?.uid

  useEffect(() => {
    if (!uid) return
    const fetchProfile = async () => {
      const snap = await getDoc(doc(db, "users", uid))
      if (snap.exists()) setName(snap.data().name || "Guest")
    }
    fetchProfile()
  }, [uid])

  const handleSaveName = async () => {
    if (!draftName.trim()) return
    setSaving(true)
    try {
      await updateDoc(doc(db, "users", uid), { name: draftName.trim() })
      setName(draftName.trim())
      setEditingName(false)
    } catch (e) {
      Alert.alert("Error", "Could not save name. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleStartEdit = () => { setDraftName(name); setEditingName(true) }
  const handleCancel = () => { setEditingName(false); setDraftName("") }
  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigation.reset({
        index: 0,
        routes: [{ name: "Auth" }],
      })
    } catch (e) {
      Alert.alert(t("error"), t("unknownError"))
    }
  }

  return (
    <SafeAreaView style={[{ flex: 1 }, { backgroundColor: colors.background }]} edges={["left", "right"]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.header }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backBtn, { color: colors.headerText }]}>{t("back")}</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.headerText }]}>{t("settings")}</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Profile section */}
      <View style={[styles.profileSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Avatar name={uid ? name : "Guest"} size={84} />

        {!uid ? (
          <View style={styles.nameRow}>
            <Text style={[styles.nameText, { color: colors.text }]}>{t("guest")}</Text>
            <Text style={[styles.editHint, { color: colors.hint }]}>{t("loginToEditProfile")}</Text>
          </View>
        ) : editingName ? (
          <View style={styles.nameEditRow}>
            <TextInput
              value={draftName}
              onChangeText={setDraftName}
              style={[styles.nameInput, { borderColor: colors.myBubble, color: colors.text, backgroundColor: colors.inputBg }]}
              autoFocus
              maxLength={40}
              returnKeyType="done"
              onSubmitEditing={handleSaveName}
              placeholderTextColor={colors.hint}
            />
            <TouchableOpacity onPress={handleSaveName} disabled={saving} style={[styles.saveBtn, { backgroundColor: colors.myBubble }]}>
              {saving
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={styles.saveBtnText}>Save</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn}>
              <Text style={[styles.cancelBtnText, { color: colors.hint }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={handleStartEdit} style={styles.nameRow}>
            <Text style={[styles.nameText, { color: colors.text }]}>{name}</Text>
            <Text style={[styles.editHint, { color: colors.hint }]}>✏️ tap to edit</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Dark mode toggle */}
      <View style={[styles.settingRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.settingLabel, { color: colors.text }]}>{t("darkMode")}</Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: '#ccc', true: colors.myBubble }}
          thumbColor={isDark ? colors.headerText : '#fff'}
        />
      </View>

      {/* Language toggle */}
      <View style={[styles.settingRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.settingLabel, { color: colors.text }]}>
          {isFinnish ? "Suomi" : "English"}
        </Text>
        <Switch
          value={isFinnish}
          onValueChange={toggleLanguage}
          trackColor={{ false: '#ccc', true: colors.myBubble }}
          thumbColor={isFinnish ? colors.headerText : '#fff'}
        />
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={handleLogout}
      >
        <Text style={[styles.logoutText, { color: colors.text }]}>{t("logout")}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 48,
  },
  backBtn: { fontSize: 16, fontWeight: "600" },
  title: { fontSize: 18, fontWeight: "600" },

  profileSection: {
    alignItems: "center",
    paddingVertical: 28,
    borderBottomWidth: 1,
    gap: 14,
  },

  nameRow: { alignItems: "center", gap: 4 },
  nameText: { fontSize: 20, fontWeight: "700" },
  editHint: { fontSize: 12 },

  nameEditRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
  },
  nameInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  saveBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
  },
  saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  cancelBtn: { paddingHorizontal: 8, paddingVertical: 9 },
  cancelBtnText: { fontSize: 14 },

  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  settingLabel: { fontSize: 16, fontWeight: "500" },
  logoutButton: {
    marginTop: 24,
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  logoutText: { fontSize: 16, fontWeight: "700" },
})
