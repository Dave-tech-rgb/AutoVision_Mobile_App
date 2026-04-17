import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0E1A' },
  topBar: { padding: 20, paddingBottom: 12 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: '#CCD6F6' },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 12 },
  filterPill: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7, backgroundColor: '#131929', borderWidth: 1, borderColor: '#1E2A3A' },
  filterPillActive: { backgroundColor: '#00D4FF', borderColor: '#00D4FF' },
  filterText: { color: '#8892B0', fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: '#0A0E1A' },
  list: { padding: 20, paddingTop: 0, gap: 12, paddingBottom: 40 },
  card: { backgroundColor: '#131929', borderRadius: 14, padding: 16, gap: 12 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  confidence: { color: '#8892B0', fontSize: 13, fontWeight: '600' },
  cardDetails: { gap: 4 },
  labelText: { color: '#CCD6F6', fontSize: 14, fontWeight: '600' },
  detailText: { color: '#8892B0', fontSize: 13 },
  emptyBox: { alignItems: 'center', marginTop: 80, gap: 12 },
  emptyIcon: { fontSize: 48 },
  emptyText: { color: '#4A5568', fontSize: 15 },
});