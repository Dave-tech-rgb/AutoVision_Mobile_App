import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  RefreshControl, SafeAreaView, TouchableOpacity,
} from 'react-native';
import { dashboardAPI } from '../../services/api';
import { useAuth } from '../../store/authStore';
import { router } from 'expo-router';
import { COLORS } from '../../styles/Theme';

function StatCard({ icon, label, value }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value ?? '0'}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ActionCard({ icon, label, sub, onPress }) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.actionIconBox}>
        <Text style={styles.actionIcon}>{icon}</Text>
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
      <Text style={styles.actionSub}>{sub}</Text>
    </TouchableOpacity>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');

  const loadStats = useCallback(async () => {
    try {
      const data = await dashboardAPI.stats();
      setStats(data);
    } catch (_) {}
    finally { setRefreshing(false); }
  }, []);

  useEffect(() => { loadStats(); }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadStats(); }} tintColor={COLORS.primary} />
        }
      >
        {/* Page Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Vehicle Detection Dashboard</Text>
          <TouchableOpacity style={styles.refreshBtn} onPress={() => { setRefreshing(true); loadStats(); }}>
            <Text style={styles.refreshText}>↻  Refresh</Text>
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <View style={styles.greetingBox}>
          <Text style={styles.greetingLabel}>SYSTEM OVERVIEW</Text>
          <Text style={styles.greetingText}>
            {getGreeting()}, {user?.username ?? 'Admin'} 🚗
          </Text>
          <Text style={styles.greetingSub}>
            Monitor live feeds, review detections, and manage your devices.
          </Text>
        </View>

        {/* Stats */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll} contentContainerStyle={{ paddingRight: 8 }}>
          <StatCard icon="📷" label="LIVE FEEDS"   value={stats?.activeDevices} />
          <StatCard icon="🔍" label="DETECTIONS"   value={stats?.totalDetections} />
          <StatCard icon="🚗" label="VEHICLES"     value={stats?.todayDetections} />
          <StatCard icon="⚠️" label="ALERTS"       value="0" />
          <StatCard icon="📡" label="DEVICES"      value={stats?.totalDevices} />
        </ScrollView>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {['Overview', 'Live Feed', 'Logs'].map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tabBtn, activeTab === t && styles.tabBtnActive]}
              onPress={() => setActiveTab(t)}
            >
              <Text style={[styles.tabBtnText, activeTab === t && styles.tabBtnTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
          <Text style={styles.modulesText}>4 modules</Text>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <ActionCard icon="📷" label="Live Camera"    sub="Monitor active feeds"    onPress={() => router.push('/(tabs)/detect')} />
          <ActionCard icon="📋" label="Detection Logs" sub="Browse capture history"  onPress={() => router.push('/(tabs)/logs')} />
          <ActionCard icon="📡" label="Devices"        sub="Manage camera devices"   onPress={() => router.push('/(tabs)/devices')} />
          <ActionCard icon="👤" label="Users"          sub="Manage system users"     onPress={() => router.push('/(tabs)/users')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { padding: 20, paddingBottom: 40 },
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  pageTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  refreshBtn: { backgroundColor: COLORS.surface, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: COLORS.border },
  refreshText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
  greetingBox: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  greetingLabel: { fontSize: 10, color: COLORS.textMuted, letterSpacing: 1.5, fontWeight: '700', marginBottom: 6 },
  greetingText: { fontSize: 21, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 6 },
  greetingSub: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
  statsScroll: { marginBottom: 16 },
  statCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, marginRight: 10, minWidth: 110, borderWidth: 1, borderColor: COLORS.border },
  statIcon: { fontSize: 22, marginBottom: 10 },
  statValue: { fontSize: 28, fontWeight: '900', color: COLORS.textPrimary, marginBottom: 4 },
  statLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '700', letterSpacing: 0.5 },
  tabRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  tabBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6, marginRight: 8, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  tabBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabBtnText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  tabBtnTextActive: { color: '#FFF' },
  modulesText: { marginLeft: 'auto', fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  actionCard: { width: '48%', backgroundColor: COLORS.surface, borderRadius: 12, padding: 18, marginBottom: 12, marginRight: '2%', borderWidth: 1, borderColor: COLORS.border },
  actionIconBox: { width: 44, height: 44, borderRadius: 10, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  actionIcon: { fontSize: 20 },
  actionLabel: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  actionSub: { fontSize: 12, color: COLORS.textSecondary },
});