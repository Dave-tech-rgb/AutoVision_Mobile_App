import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0E1A' },
  container: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, marginTop: 8 },
  greeting: { color: '#8892B0', fontSize: 13 },
  username: { color: '#CCD6F6', fontSize: 20, fontWeight: '800' },
  logoutBtn: { backgroundColor: '#1E2A3A', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  logoutText: { color: '#FF4D6D', fontSize: 13, fontWeight: '700' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  statCard: {
    flex: 1, minWidth: '45%', backgroundColor: '#131929',
    borderRadius: 14, padding: 18, borderTopWidth: 3, alignItems: 'center', gap: 4,
  },
  statIcon: { fontSize: 24 },
  statValue: { fontSize: 26, fontWeight: '900' },
  statLabel: { color: '#8892B0', fontSize: 12 },
  sectionTitle: { color: '#CCD6F6', fontSize: 16, fontWeight: '800', marginBottom: 12 },
  actionsRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  actionBtn: {
    flex: 1, backgroundColor: '#131929', borderRadius: 12,
    padding: 14, alignItems: 'center', gap: 6,
  },
  actionIcon: { fontSize: 24 },
  actionLabel: { color: '#8892B0', fontSize: 11, fontWeight: '600' },
  recentCard: { backgroundColor: '#131929', borderRadius: 14, overflow: 'hidden' },
  recentRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderBottomWidth: 1, borderBottomColor: '#1E2A3A',
  },
  recentLabel: { color: '#CCD6F6', fontSize: 14, fontWeight: '600' },
  recentDate: { color: '#8892B0', fontSize: 12, marginTop: 2 },
  badge: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  emptyText: { color: '#4A5568', padding: 20, textAlign: 'center' },
});