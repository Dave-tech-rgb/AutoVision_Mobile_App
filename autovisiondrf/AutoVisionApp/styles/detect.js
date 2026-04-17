import { StyleSheet } from 'react-native';

export const CORNER_SIZE = 20;
export const CORNER_THICKNESS = 3;
export const CORNER_COLOR = '#00D4FF';

export default StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0E1A' },
  centered: { flex: 1, backgroundColor: '#0A0E1A', justifyContent: 'center', alignItems: 'center', padding: 30, gap: 12 },
  container: { flexGrow: 1, padding: 20, paddingBottom: 40, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: '#00D4FF', marginTop: 8 },
  subtitle: { color: '#8892B0', fontSize: 13, marginBottom: 20 },
  cameraWrapper: { width: '100%', borderRadius: 16, overflow: 'hidden', backgroundColor: '#131929' },
  camera: { width: '100%', height: 320 },
  overlay: { flex: 1, position: 'relative' },
  cornerTL: { position: 'absolute', top: '25%', left: '10%', width: CORNER_SIZE, height: CORNER_SIZE, borderTopWidth: CORNER_THICKNESS, borderLeftWidth: CORNER_THICKNESS, borderColor: CORNER_COLOR },
  cornerTR: { position: 'absolute', top: '25%', right: '10%', width: CORNER_SIZE, height: CORNER_SIZE, borderTopWidth: CORNER_THICKNESS, borderRightWidth: CORNER_THICKNESS, borderColor: CORNER_COLOR },
  cornerBL: { position: 'absolute', bottom: '25%', left: '10%', width: CORNER_SIZE, height: CORNER_SIZE, borderBottomWidth: CORNER_THICKNESS, borderLeftWidth: CORNER_THICKNESS, borderColor: CORNER_COLOR },
  cornerBR: { position: 'absolute', bottom: '25%', right: '10%', width: CORNER_SIZE, height: CORNER_SIZE, borderBottomWidth: CORNER_THICKNESS, borderRightWidth: CORNER_THICKNESS, borderColor: CORNER_COLOR },
  loadingBox: { marginTop: 20, alignItems: 'center', gap: 8 },
  loadingText: { color: '#00D4FF', fontSize: 14 },
  resultCard: { marginTop: 20, backgroundColor: '#131929', borderRadius: 12, padding: 20, width: '100%', borderLeftWidth: 4 },
  resultTitle: { fontSize: 17, fontWeight: '700', color: '#CCD6F6', marginBottom: 12 },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#1E2A3A' },
  resultLabel: { color: '#8892B0', fontSize: 14 },
  resultValue: { color: '#CCD6F6', fontSize: 14, fontWeight: '600' },
  btnRow: { marginTop: 24, width: '100%', gap: 12 },
  btn: { backgroundColor: '#00D4FF', borderRadius: 12, padding: 16, alignItems: 'center' },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#0A0E1A', fontWeight: '800', fontSize: 16 },
  btnOutline: { borderWidth: 2, borderColor: '#00D4FF', borderRadius: 12, padding: 16, alignItems: 'center' },
  btnOutlineText: { color: '#00D4FF', fontWeight: '700', fontSize: 16 },
});