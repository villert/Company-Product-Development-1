import React, { useEffect, useState } from "react"
import {
  View, Text, TouchableOpacity, StyleSheet,
  TextInput, ActivityIndicator, Alert
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { SafeAreaView } from "react-native-safe-area-context"
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { firebaseApp } from "../firebase"
import Themes from "../themes/Themes"

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
  const [name, setName] = useState("")
  const [editingName, setEditingName] = useState(false)
  const [draftName, setDraftName] = useState("")
  const [saving, setSaving] = useState(false)

  const uid = auth.currentUser?.isAnonymous ? null : auth.currentUser?.uid

  useEffect(() => {
    if (!uid) return
    const fetchProfile = async () => {
      const snap = await getDoc(doc(db, "users", uid))
      if (snap.exists()) {
        setName(snap.data().name || "Guest")
      }
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

  const handleStartEdit = () => {
    setDraftName(name)
    setEditingName(true)
  }

  const handleCancel = () => {
    setEditingName(false)
    setDraftName("")
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Profile section */}
      <View style={styles.profileSection}>
        <Avatar name={name} size={84} />

        {!uid ? (
          // Guest — not logged in
          <View style={styles.nameRow}>
            <Text style={styles.nameText}>Guest</Text>
            <Text style={styles.editHint}>Log in to edit your profile</Text>
          </View>
        ) : editingName ? (
          <View style={styles.nameEditRow}>
            <TextInput
              value={draftName}
              onChangeText={setDraftName}
              style={styles.nameInput}
              autoFocus
              maxLength={40}
              returnKeyType="done"
              onSubmitEditing={handleSaveName}
            />
            <TouchableOpacity onPress={handleSaveName} disabled={saving} style={styles.saveBtn}>
              {saving
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={styles.saveBtnText}>Save</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={handleStartEdit} style={styles.nameRow}>
            <Text style={styles.nameText}>{name}</Text>
            <Text style={styles.editHint}>✏️ tap to edit</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Rest of settings */}
      <View style={Themes.centeredContainer}>
        <Text style={Themes.centeredText}>More settings coming soon</Text>
      </View>
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
    backgroundColor: "#8dc9a4",
  },
  backBtn: { fontSize: 16, color: "#333", fontWeight: "600" },
  title: { fontSize: 18, fontWeight: "600" },

  profileSection: {
    alignItems: "center",
    paddingVertical: 28,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    gap: 14,
  },

  nameRow: { alignItems: "center", gap: 4 },
  nameText: { fontSize: 20, fontWeight: "700", color: "#222" },
  editHint: { fontSize: 12, color: "#999" },

  nameEditRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
  },
  nameInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#8dc9a4",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#222",
  },
  saveBtn: {
    backgroundColor: "#8dc9a4",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
  },
  saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  cancelBtn: { paddingHorizontal: 8, paddingVertical: 9 },
  cancelBtnText: { color: "#999", fontSize: 14 },
})