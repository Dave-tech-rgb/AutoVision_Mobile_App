import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity, TextInput, Modal, Alert,
  RefreshControl, ActivityIndicator,
} from 'react-native';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../store/authStore';
import { COLORS } from '../../styles/Theme';

const EMPTY_FORM = { username: '', email: '', password: '', is_staff: false };

export default function UsersScreen() {
  const { logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await usersAPI.list();
      setUsers(data?.results ?? data ?? []);
    } catch (err) {
      if (err.message === 'SESSION_EXPIRED') logout();
    } finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setModalVisible(true); };
  const openEdit = (u) => { setEditing(u); setForm({ username: u.username, email: u.email ?? '', password: '', is_staff: u.is_staff ?? false }); setModalVisible(true); };
  const closeModal = () => { setModalVisible(false); setEditing(null); setForm(EMPTY_FORM); };

  const handleSave = async () => {
    if (!form.username.trim()) { Alert.alert('Error', 'Username is required.'); return; }
    if (!editing && !form.password.trim()) { Alert.alert('Error', 'Password is required.'); return; }
    setSaving(true);
    try {
      const payload = { username: form.username, email: form.email, is_staff: form.is_staff };
      if (form.password.trim()) payload.password = form.password;
      editing ? await usersAPI.update(editing.id, payload) : await usersAPI.create(payload);
      closeModal(); load();
    } catch (err) { Alert.alert('Error', err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = (user) => {
    Alert.alert('Delete User', `Remove "${user.username}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { try { await usersAPI.delete(user.id); load(); } catch (err) { Alert.alert('Error', err.message); } } },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Manage Users</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Text style={styles.addBtnText}>+ Add User</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={COLORS.primary} />}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 60 }} />
        ) : users.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>👤</Text>
            <Text style={styles.emptyTitle}>No Users</Text>
            <Text style={styles.emptyText}>No users found in the system.</Text>
          </View>
        ) : (
          users.map((user) => (
            <View key={user.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{user.username?.[0]?.toUpperCase() ?? '?'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.cardName}>{user.username}</Text>
                    {user.is_staff && (
                      <View style={styles.adminBadge}>
                        <Text style={styles.adminBadgeText}>Admin</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.cardEmail}>{user.email || 'No email'}</Text>
                </View>
                <View style={[styles.activeBadge, { backgroundColor: user.is_active !== false ? COLORS.successBg : COLORS.dangerBg }]}>
                  <Text style={[styles.activeBadgeText, { color: user.is_active !== false ? COLORS.success : COLORS.danger }]}>
                    {user.is_active !== false ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
              <View style={styles.cardDivider} />
              <View style={styles.cardActions}>
                {user.date_joined && (
                  <Text style={styles.cardDate}>Joined {new Date(user.date_joined).toLocaleDateString()}</Text>
                )}
                <View style={styles.actionBtns}>
                  <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(user)}>
                    <Text style={styles.editBtnText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(user)}>
                    <Text style={styles.deleteBtnText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editing ? 'Edit User' : 'Add User'}</Text>

            <Text style={styles.label}>Username *</Text>
            <TextInput style={styles.input} placeholder="username" placeholderTextColor={COLORS.textMuted} value={form.username} onChangeText={(v) => setForm((f) => ({ ...f, username: v }))} autoCapitalize="none" />

            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} placeholder="user@email.com" placeholderTextColor={COLORS.textMuted} value={form.email} onChangeText={(v) => setForm((f) => ({ ...f, email: v }))} keyboardType="email-address" autoCapitalize="none" />

            <Text style={styles.label}>{editing ? 'New Password (leave blank to keep)' : 'Password *'}</Text>
            <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={COLORS.textMuted} value={form.password} onChangeText={(v) => setForm((f) => ({ ...f, password: v }))} secureTextEntry />

            <Text style={styles.label}>Role</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity style={[styles.toggleBtn, !form.is_staff && styles.toggleBtnActive]} onPress={() => setForm((f) => ({ ...f, is_staff: false }))}>
                <Text style={[styles.toggleText, !form.is_staff && styles.toggleTextActive]}>Staff</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.toggleBtn, form.is_staff && styles.toggleBtnAdmin]} onPress={() => setForm((f) => ({ ...f, is_staff: true }))}>
                <Text style={[styles.toggleText, form.is_staff && styles.toggleTextAdmin]}>Admin</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeModal} disabled={saving}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.5 }]} onPress={handleSave} disabled={saving}>
                {saving ? <ActivityIndicator color="#FFF" size="small" /> : <Text style={styles.saveBtnText}>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 12 },
  pageTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  addBtn: { backgroundColor: COLORS.primary, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  addBtnText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  container: { padding: 20, paddingTop: 0, paddingBottom: 40 },
  emptyBox: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 6 },
  emptyText: { fontSize: 13, color: COLORS.textSecondary },
  card: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  cardName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginRight: 8 },
  adminBadge: { backgroundColor: '#FFF5F0', borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2 },
  adminBadgeText: { color: COLORS.primary, fontSize: 10, fontWeight: '700' },
  cardEmail: { fontSize: 12, color: COLORS.textSecondary },
  activeBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  activeBadgeText: { fontSize: 11, fontWeight: '700' },
  cardDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
  cardActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardDate: { fontSize: 12, color: COLORS.textMuted },
  actionBtns: { flexDirection: 'row' },
  editBtn: { backgroundColor: COLORS.infoBg, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8 },
  editBtnText: { color: COLORS.info, fontSize: 12, fontWeight: '700' },
  deleteBtn: { backgroundColor: COLORS.dangerBg, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 6 },
  deleteBtnText: { color: COLORS.danger, fontSize: 12, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 28 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: COLORS.bg, borderRadius: 10, padding: 14, color: COLORS.textPrimary, fontSize: 14, borderWidth: 1, borderColor: COLORS.border },
  toggleRow: { flexDirection: 'row' },
  toggleBtn: { flex: 1, borderRadius: 8, padding: 12, alignItems: 'center', backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border, marginRight: 8 },
  toggleBtnActive: { backgroundColor: COLORS.successBg, borderColor: COLORS.success },
  toggleBtnAdmin: { backgroundColor: '#FFF5F0', borderColor: COLORS.primary },
  toggleText: { color: COLORS.textSecondary, fontWeight: '700', fontSize: 13 },
  toggleTextActive: { color: COLORS.success },
  toggleTextAdmin: { color: COLORS.primary },
  modalActions: { flexDirection: 'row', marginTop: 24 },
  cancelBtn: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 14, alignItems: 'center', marginRight: 10 },
  cancelText: { color: COLORS.textSecondary, fontWeight: '700' },
  saveBtn: { flex: 1, backgroundColor: COLORS.primary, borderRadius: 10, padding: 14, alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
});