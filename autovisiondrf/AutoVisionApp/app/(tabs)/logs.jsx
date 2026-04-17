import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, SafeAreaView,
  TouchableOpacity, RefreshControl, ActivityIndicator,
} from 'react-native';
import { detectionsAPI } from '../../services/api';
import { useAuth } from '../../store/authStore';
import { COLORS } from '../../styles/Theme';

const FILTERS = ['All', 'Detected', 'None'];

function LogItem({ item }) {
  const date = item.detected_at ? new Date(item.detected_at) : null;
  const detected = item.vehicles_detected;
  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <View style={[styles.iconBox, { backgroundColor: detected ? COLORS.successBg : COLORS.dangerBg }]}>
          <Text style={styles.cardIconText}>{detected ? '🚗' : '❌'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{item.label || (detected ? 'Vehicle Detected' : 'No Vehicle')}</Text>
          {date && <Text style={styles.cardDate}>{date.toLocaleDateString()} {date.toLocaleTimeString()}</Text>}
          {item.device_name && <Text style={styles.cardDevice}>📡 {item.device_name}</Text>}
        </View>
        <View style={styles.rightCol}>
          <View style={[styles.badge, { backgroundColor: detected ? COLORS.successBg : COLORS.dangerBg }]}>
            <Text style={[styles.badgeText, { color: detected ? COLORS.success : COLORS.danger }]}>
              {detected ? 'Detected' : 'None'}
            </Text>
          </View>
          {item.confidence != null && (
            <Text style={styles.confidence}>{(item.confidence * 100).toFixed(0)}%</Text>
          )}
        </View>
      </View>
    </View>
  );
}

export default function LogsScreen() {
  const { logout } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('All');

  const load = useCallback(async () => {
    try {
      const params = {};
      if (filter === 'Detected') params.vehicles_detected = true;
      if (filter === 'None') params.vehicles_detected = false;
      const data = await detectionsAPI.list(params);
      setLogs(data?.results ?? data ?? []);
    } catch (err) {
      if (err.message === 'SESSION_EXPIRED') logout();
    } finally { setLoading(false); setRefreshing(false); }
  }, [filter]);

  useEffect(() => { setLoading(true); load(); }, [filter]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Detection Logs</Text>
        <Text style={styles.pageCount}>{logs.length} records</Text>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterPill, filter === f && styles.filterPillActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item, i) => String(item.id ?? i)}
          renderItem={({ item }) => <LogItem item={item} />}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={COLORS.primary} />}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>No Logs</Text>
              <Text style={styles.emptyText}>No detection logs found.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 12 },
  pageTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  pageCount: { fontSize: 13, color: COLORS.textMuted, fontWeight: '600' },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 12 },
  filterPill: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, marginRight: 8 },
  filterPillActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: '#FFF' },
  list: { padding: 20, paddingTop: 0, paddingBottom: 40 },
  card: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 42, height: 42, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardIconText: { fontSize: 20 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  cardDate: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  cardDevice: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  rightCol: { alignItems: 'flex-end' },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 4 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  confidence: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  emptyBox: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 6 },
  emptyText: { fontSize: 13, color: COLORS.textSecondary },
});