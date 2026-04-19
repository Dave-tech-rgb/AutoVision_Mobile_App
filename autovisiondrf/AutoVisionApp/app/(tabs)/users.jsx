import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity, TextInput, Modal, Alert,
  RefreshControl, ActivityIndicator,
} from 'react-native';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../store/authStore';
import { COLORS } from '../../styles/Theme';

const EMPTY_FORM = {
  username: '',
  email: '',
  password: '',
  role: 'viewer',
  is_active: true,
};

const ROLES = [
  { key: 'admin',  label: 'Admin',  desc: 'Full access',    color: COLORS.danger,  bg: COLORS.dangerBg  },
  { key: 'staff',  label: 'Staff',  desc: 'Manage content', color: COLORS.warning, bg: COLORS.warningBg },
  { key: 'viewer', label: 'Viewer', desc: 'View only',      color: COLORS.info,    bg: COLORS.infoBg    },
];

function getRoleInfo(user) {
  if (user.is_superuser) return ROLES[0];
  if (user.is_staff)     return ROLES[1];
  return ROLES[2];
}

function StatsBar({ users }) {
  const total  = users.length;
  const admins = users.filter((u) => u.is_superuser).length;
  const staff  = users.filter((u) => u.is_staff && !u.is_superuser).length;
  const active = users.filter((u) => u.is_active !== false).length;
  return (
    <View style={styles.statsBar}>
      <StatItem label="Total"  value={total}  color={COLORS.primary} />
      <StatItem label="Active" value={active} color={COLORS.success} />
      <StatItem label="Admin"  value={admins} color={COLORS.danger}  />
      <StatItem label="Staff"  value={staff}  color={COLORS.warning} />
    </View>
  );
}

function StatItem({ label, value, color }) {
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function UserCard({ user, onEdit, onDelete, onToggleActive }) {
  const role = getRoleInfo(user);
  const isActive = user.is_active !== false;
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={[styles.avatar, { backgroundColor: role.color }]}>
          <Text style={styles.avatarText}>{user.username?.[0]?.toUpperCase() ?? '?'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={styles.cardName}>{user.username}</Text>
            <View style={[styles.roleBadge, { backgroundColor: role.bg }]}>
              <Text style={[styles.roleBadgeText, { color: role.color }]}>{role.label}</Text>
            </View>
          </View>
          <Text style={styles.cardEmail}>{user.email || 'No email set'}</Text>
        </View>
        <TouchableOpacity
          style={[styles.activePill, { backgroundColor: isActive ? COLORS.successBg : COLORS.dangerBg }]}
          onPress={() => onToggleActive(user)}
          activeOpacity={0.7}
        >
          <View style={[styles.activeDot, { backgroundColor: isActive ? COLORS.success : COLORS.danger }]} />
          <Text style={[styles.activeText, { color: isActive ? COLORS.success : COLORS.danger }]}>
            {isActive ? 'Active' : 'Inactive'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.roleDescRow, { backgroundColor: role.bg }]}>
        <Text style={styles.roleDescIcon}>🔐</Text>
        <Text style={[styles.roleDescText, { color: role.color }]}>
          {role.desc} · Joined {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : '—'}
        </Text>
      </View>

      <View style={styles.cardDivider} />
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(user)}>
          <Text style={styles.editBtnText}>✏️  Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(user)}>
          <Text style={styles.deleteBtnText}>🗑️  Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function UsersScreen() {
  const { logout } = useAuth();
  const [users, setUsers]               = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [search, setSearch]             = useState('');
  const [roleFilter, setRoleFilter]     = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing]           = useState(null);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [saving, setSaving]             = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await usersAPI.list();
      const list = data?.results ?? data ?? [];
      setUsers(list);
      applyFilters(list, search, roleFilter);
    } catch (err) {
      if (err.message === 'SESSION_EXPIRED') logout();
    } finally { setLoading(false); setRefreshing(false); }
  }, [search, roleFilter]);

  useEffect(() => { load(); }, []);

  const applyFilters = (list, q, role) => {
    let result = list;
    if (q.trim()) {
      const lower = q.toLowerCase();
      result = result.filter(
        (u) => u.username?.toLowerCase().includes(lower) || u.email?.toLowerCase().includes(lower)
      );
    }
    if (role === 'Admin')  result = result.filter((u) => u.is_superuser);
    if (role === 'Staff')  result = result.filter((u) => u.is_staff && !u.is_superuser);
    if (role === 'Viewer') result = result.filter((u) => !u.is_staff);
    setFiltered(result);
  };

  const handleSearch = (q) => { setSearch(q); applyFilters(users, q, roleFilter); };
  const handleRoleFilter = (role) => { setRoleFilter(role); applyFilters(users, search, role); };

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setShowPassword(false); setModalVisible(true); };
  const openEdit = (user) => {
    setEditing(user);
    setForm({ username: user.username, email: user.email ?? '', password: '', role: getRoleInfo(user).key, is_active: user.is_active !== false });
    setShowPassword(false);
    setModalVisible(true);
  };
  const closeModal = () => { setModalVisible(false); setEditing(null); setForm(EMPTY_FORM); };

  const handleSave = async () => {
    if (!form.username.trim()) { Alert.alert('Error', 'Username is required.'); return; }
    if (!editing && !form.password.trim()) { Alert.alert('Error', 'Password is required for new users.'); return; }
    setSaving(true);
    try {
      const payload = {
        username:     form.username.trim(),
        email:        form.email.trim(),
        is_superuser: form.role === 'admin',
        is_staff:     form.role === 'admin' || form.role === 'staff',
        is_active:    form.is_active,
      };
      if (form.password.trim()) payload.password = form.password;
      editing ? await usersAPI.update(editing.id, payload) : await usersAPI.create(payload);
      closeModal(); load();
    } catch (err) { Alert.alert('Error', err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = (user) => {
    Alert.alert('Delete User', `Remove "${user.username}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { try { await usersAPI.delete(user.id); load(); } catch (err) { Alert.alert('Error', err.message); } } },
    ]);
  };

  const handleToggleActive = (user) => {
    const action = user.is_active === false ? 'Activate' : 'Deactivate';
    Alert.alert('Change Status', `${action} "${user.username}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          try {
            await usersAPI.toggleActive(user.id);
            load();
          } catch {
            try { await usersAPI.update(user.id, { is_active: !user.is_active }); load(); }
            catch (e) { Alert.alert('Error', e.message); }
          }
        },
      },
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

      {!loading && <StatsBar users={users} />}

      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search username or email..."
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.filterRow}>
        {['All', 'Admin', 'Staff', 'Viewer'].map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.filterPill, roleFilter === r && styles.filterPillActive]}
            onPress={() => handleRoleFilter(r)}
          >
            <Text style={[styles.filterText, roleFilter === r && styles.filterTextActive]}>{r}</Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.countText}>{filtered.length} users</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 60 }} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={COLORS.primary} />}
        >
          {filtered.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>👤</Text>
              <Text style={styles.emptyTitle}>No Users Found</Text>
              <Text style={styles.emptyText}>{search ? 'Try a different search term.' : 'Add your first user.'}</Text>
            </View>
          ) : (
            filtered.map((user) => (
              <UserCard key={user.id} user={user} onEdit={openEdit} onDelete={handleDelete} onToggleActive={handleToggleActive} />
            ))
          )}
        </ScrollView>
      )}

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.modalTitle}>
                {editing ? `Edit — ${editing.username}` : 'Add New User'}
              </Text>

              <Text style={styles.label}>Username *</Text>
              <TextInput style={styles.input} placeholder="username" placeholderTextColor={COLORS.textMuted} value={form.username} onChangeText={(v) => setForm((f) => ({ ...f, username: v }))} autoCapitalize="none" autoCorrect={false} />

              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} placeholder="user@email.com" placeholderTextColor={COLORS.textMuted} value={form.email} onChangeText={(v) => setForm((f) => ({ ...f, email: v }))} keyboardType="email-address" autoCapitalize="none" />

              <Text style={styles.label}>{editing ? 'New Password (leave blank to keep)' : 'Password *'}</Text>
              <View style={styles.passwordRow}>
                <TextInput style={[styles.input, { flex: 1 }]} placeholder="••••••••" placeholderTextColor={COLORS.textMuted} value={form.password} onChangeText={(v) => setForm((f) => ({ ...f, password: v }))} secureTextEntry={!showPassword} autoCapitalize="none" />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword((v) => !v)}>
                  <Text>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Role & Permissions</Text>
              <View style={styles.roleGrid}>
                {ROLES.map((r) => (
                  <TouchableOpacity
                    key={r.key}
                    style={[styles.roleCard, form.role === r.key && { borderColor: r.color, backgroundColor: r.bg }]}
                    onPress={() => setForm((f) => ({ ...f, role: r.key }))}
                    activeOpacity={0.8}
                  >
                    <View style={styles.roleCardTop}>
                      <Text style={[styles.roleCardLabel, form.role === r.key && { color: r.color }]}>{r.label}</Text>
                      {form.role === r.key && (
                        <View style={[styles.roleCheck, { backgroundColor: r.color }]}>
                          <Text style={styles.roleCheckText}>✓</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.roleCardDesc}>{r.desc}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Account Status</Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity style={[styles.toggleBtn, form.is_active && styles.toggleActive]} onPress={() => setForm((f) => ({ ...f, is_active: true }))}>
                  <Text style={[styles.toggleText, form.is_active && { color: COLORS.success }]}>✅  Active</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.toggleBtn, !form.is_active && styles.toggleInactive]} onPress={() => setForm((f) => ({ ...f, is_active: false }))}>
                  <Text style={[styles.toggleText, !form.is_active && { color: COLORS.danger }]}>🚫  Inactive</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={closeModal} disabled={saving}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.5 }]} onPress={handleSave} disabled={saving}>
                  {saving ? <ActivityIndicator color="#FFF" size="small" /> : <Text style={styles.saveBtnText}>{editing ? 'Save Changes' : 'Create User'}</Text>}
                </TouchableOpacity>
              </View>
            </ScrollView>
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
  statsBar: { flexDirection: 'row', backgroundColor: COLORS.surface, marginHorizontal: 20, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRightWidth: 1, borderRightColor: COLORS.border },
  statValue: { fontSize: 20, fontWeight: '900', marginBottom: 2 },
  statLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600' },
  searchRow: { paddingHorizontal: 20, marginBottom: 10 },
  searchInput: { backgroundColor: COLORS.surface, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: COLORS.textPrimary, borderWidth: 1, borderColor: COLORS.border },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 12, alignItems: 'center' },
  filterPill: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, marginRight: 8 },
  filterPillActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: '#FFF' },
  countText: { marginLeft: 'auto', fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  container: { padding: 20, paddingTop: 0, paddingBottom: 40 },
  card: { backgroundColor: COLORS.surface, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  cardTop: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  avatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  cardName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginRight: 8 },
  roleBadge: { borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2 },
  roleBadgeText: { fontSize: 10, fontWeight: '800' },
  cardEmail: { fontSize: 12, color: COLORS.textSecondary },
  activePill: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  activeDot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  activeText: { fontSize: 11, fontWeight: '700' },
  roleDescRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8 },
  roleDescIcon: { fontSize: 12, marginRight: 6 },
  roleDescText: { fontSize: 12, fontWeight: '600' },
  cardDivider: { height: 1, backgroundColor: COLORS.border },
  cardActions: { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 10 },
  editBtn: { backgroundColor: COLORS.infoBg, borderRadius: 6, paddingHorizontal: 14, paddingVertical: 7, marginRight: 8 },
  editBtnText: { color: COLORS.info, fontSize: 12, fontWeight: '700' },
  deleteBtn: { backgroundColor: COLORS.dangerBg, borderRadius: 6, paddingHorizontal: 14, paddingVertical: 7 },
  deleteBtnText: { color: COLORS.danger, fontSize: 12, fontWeight: '700' },
  emptyBox: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 6 },
  emptyText: { fontSize: 13, color: COLORS.textSecondary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '90%' },
  modalTitle: { fontSize: 17, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6, marginTop: 14 },
  input: { backgroundColor: COLORS.bg, borderRadius: 10, padding: 13, color: COLORS.textPrimary, fontSize: 14, borderWidth: 1, borderColor: COLORS.border },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  eyeBtn: { padding: 13, backgroundColor: COLORS.bg, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, marginLeft: 8 },
  roleGrid: { flexDirection: 'row' },
  roleCard: { flex: 1, borderRadius: 10, padding: 10, marginRight: 8, backgroundColor: COLORS.bg, borderWidth: 2, borderColor: COLORS.border },
  roleCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  roleCardLabel: { fontSize: 13, fontWeight: '800', color: COLORS.textPrimary },
  roleCardDesc: { fontSize: 10, color: COLORS.textMuted },
  roleCheck: { width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  roleCheckText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  toggleRow: { flexDirection: 'row' },
  toggleBtn: { flex: 1, borderRadius: 8, padding: 12, alignItems: 'center', backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border, marginRight: 8 },
  toggleActive: { backgroundColor: COLORS.successBg, borderColor: COLORS.success },
  toggleInactive: { backgroundColor: COLORS.dangerBg, borderColor: COLORS.danger },
  toggleText: { color: COLORS.textSecondary, fontWeight: '700', fontSize: 13 },
  modalActions: { flexDirection: 'row', marginTop: 24, marginBottom: 8 },
  cancelBtn: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 14, alignItems: 'center', marginRight: 10 },
  cancelText: { color: COLORS.textSecondary, fontWeight: '700' },
  saveBtn: { flex: 1, backgroundColor: COLORS.primary, borderRadius: 10, padding: 14, alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
});