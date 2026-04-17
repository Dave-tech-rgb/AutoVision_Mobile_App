import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0E1A' },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoArea: { alignItems: 'center', marginBottom: 28 },
  logoIcon: { fontSize: 56 },
  logoTitle: { fontSize: 32, fontWeight: '900', color: '#00D4FF', marginTop: 8, letterSpacing: 2 },
  logoSub: { fontSize: 13, color: '#8892B0', marginTop: 4 },
  modeToggle: {
    flexDirection: 'row', backgroundColor: '#131929',
    borderRadius: 12, padding: 4, marginBottom: 20,
  },
  modeBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  modeBtnActive: { backgroundColor: '#00D4FF' },
  modeBtnText: { color: '#8892B0', fontWeight: '700', fontSize: 14 },
  modeBtnTextActive: { color: '#0A0E1A' },
  card: { backgroundColor: '#131929', borderRadius: 20, padding: 28, gap: 16 },
  cardTitle: { fontSize: 20, fontWeight: '800', color: '#CCD6F6' },
  cardSub: { fontSize: 13, color: '#8892B0', marginTop: -8 },
  inputGroup: { gap: 6 },
  label: { color: '#8892B0', fontSize: 13, fontWeight: '600' },
  optional: { color: '#4A5568', fontWeight: '400' },
  input: {
    backgroundColor: '#0A0E1A', borderRadius: 10, padding: 14,
    color: '#CCD6F6', fontSize: 15, borderWidth: 1, borderColor: '#1E2A3A',
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn: { padding: 14, backgroundColor: '#0A0E1A', borderRadius: 10, borderWidth: 1, borderColor: '#1E2A3A' },
  eyeIcon: { fontSize: 16 },
  submitBtn: {
    backgroundColor: '#00D4FF', borderRadius: 12,
    padding: 16, alignItems: 'center', marginTop: 4,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: '#0A0E1A', fontWeight: '800', fontSize: 16 },
  switchText: { color: '#00D4FF', textAlign: 'center', fontSize: 13, marginTop: 4 },
  footer: { color: '#4A5568', textAlign: 'center', marginTop: 32, fontSize: 12 },
});