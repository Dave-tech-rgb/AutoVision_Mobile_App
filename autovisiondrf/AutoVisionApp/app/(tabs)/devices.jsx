import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity, TextInput, Modal, Alert,
  RefreshControl, ActivityIndicator,
} from 'react-native';
import { devicesAPI } from '../../services/api';
import { useAuth } from '../../store/authStore';
import { COLORS } from '../../styles/Theme';

const EMPTY_FORM = { name: '', location: '', is_active: true };

export default function DevicesScreen() {
  const { logout } = useAuth();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await devicesAPI.list();
      setDevices(data?.results ?? data ?? []);
    } catch (err) {
      if (err.message === 'SESSION_EXPIRED') logout();
    } finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setModalVisible(true); };
  const openEdit = (d) => { setEditing(d); setForm({ name: d.name, location: d.location ?? '', is_active: d.is_active }); setModalVisible(true); };
  const closeModal = () => { setModalVisible(false); setEditing(null); setForm(EMPTY_FORM); };

  const handleSave = async () => {
    if (!form.name.trim()) { Alert.alert('Error', 'Device name is required.'); return; }
    setSaving(true);
    try {
      editing ? await devicesAPI.update(editing.id, form) : await devicesAPI.create(form);
      closeModal(); load();
    } catch (err) { Alert.alert('Error', err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = (device) => {
    Alert.alert('Delete Device', `Remove "${device.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { try { await devicesAPI.delete(device.id); load(); } catch (err) { Alert.alert('Error', err.message); } } },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Manage Devices</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Text style={styles.addBtnText}>+ Add Device</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={COLORS.primary} />}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 60 }} />
        ) : devices.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>📡</Text>
            <Text style={styles.emptyTitle}>No Devices</Text>
            <Text style={styles.emptyText}>Add your first device to get started.</Text>
          </View>
        ) : (
          devices.map((device) => (
            <View key={device.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.cardLeft}>
                  <View style={[styles.statusDot, { backgroundColor: device.is_active ? COLORS.success : COLORS.danger }]} />
                  <View>
                    <Text style={styles.cardName}>{device.name}</Text>
                    <Text style={styles.cardLocation}>{device.location || 'No location'}</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: device.is_active ? COLORS.successBg : COLORS.dangerBg }]}>
                  <Text style={[styles.statusBadgeText, { color: device.is_active ? COLORS.success : COLORS.danger }]}>
                    {device.is_active ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
              <View style={styles.cardDivider} />
              <View style={styles.cardActions}>
                {device.created_at && (
                  <Text style={styles.cardDate}>Added {new Date(device.created_at).toLocaleDateString()}</Text>
                )}
                <View style={styles.actionBtns}>
                  <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(device)}>
                    <Text style={styles.editBtnText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(device)}>
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
            <Text style={styles.modalTitle}>{editing ? 'Edit Device' : 'Add Device'}</Text>

            <Text style={styles.label}>Device Name *</Text>
            <TextInput style={styles.input} placeholder="e.g. Gate Camera 1" placeholderTextColor={COLORS.textMuted} value={form.name} onChangeText={(v) => setForm((f) => ({ ...f, name: v }))} />

            <Text style={styles.label}>Location</Text>
            <TextInput style={styles.input} placeholder="e.g. Main Entrance" placeholderTextColor={COLORS.textMuted} value={form.location} onChangeText={(v) => setForm((f) => ({ ...f, location: v }))} />

            <Text style={styles.label}>Status</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity style={[styles.toggleBtn, form.is_active && styles.toggleBtnActive]} onPress={() => setForm((f) => ({ ...f, is_active: true }))}>
                <Text style={[styles.toggleText, form.is_active && styles.toggleTextActive]}>Active</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.toggleBtn, !form.is_active && styles.toggleBtnInactive]} onPress={() => setForm((f) => ({ ...f, is_active: false }))}>
                <Text style={[styles.toggleText, !form.is_active && styles.toggleTextInactive]}>Inactive</Text>
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
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  cardName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  cardLocation: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  statusBadge: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
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
  toggleBtnInactive: { backgroundColor: COLORS.dangerBg, borderColor: COLORS.danger },
  toggleText: { color: COLORS.textSecondary, fontWeight: '700', fontSize: 13 },
  toggleTextActive: { color: COLORS.success },
  toggleTextInactive: { color: COLORS.danger },
  modalActions: { flexDirection: 'row', marginTop: 24 },
  cancelBtn: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 14, alignItems: 'center', marginRight: 10 },
  cancelText: { color: COLORS.textSecondary, fontWeight: '700' },
  saveBtn: { flex: 1, backgroundColor: COLORS.primary, borderRadius: 10, padding: 14, alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
});