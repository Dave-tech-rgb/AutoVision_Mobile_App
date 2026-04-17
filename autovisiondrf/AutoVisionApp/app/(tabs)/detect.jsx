import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, Image, ScrollView, SafeAreaView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { detectionsAPI } from '../../services/api';
import { useAuth } from '../../store/authStore';
import { COLORS } from '../../styles/Theme';

export default function DetectScreen() {
  const { logout } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [detecting, setDetecting] = useState(false);
  const [result, setResult] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraActive, setCameraActive] = useState(true);
  const cameraRef = useRef(null);

  const captureAndDetect = useCallback(async () => {
    if (!cameraRef.current || detecting) return;
    setDetecting(true);
    setResult(null);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      const resized = await manipulateAsync(
        photo.uri,
        [{ resize: { width: 640 } }],
        { compress: 0.7, format: SaveFormat.JPEG, base64: true }
      );
      setCapturedImage(resized.uri);
      setCameraActive(false);
      const data = await detectionsAPI.detect(resized.base64);
      setResult(data);
    } catch (err) {
      if (err.message === 'SESSION_EXPIRED') return logout();
      Alert.alert('Detection Failed', err.message);
    } finally { setDetecting(false); }
  }, [detecting]);

  const reset = useCallback(() => {
    setResult(null); setCapturedImage(null); setCameraActive(true);
  }, []);

  if (!permission) return <View style={styles.safe} />;

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionScreen}>
        <View style={styles.permissionCard}>
          <Text style={styles.permissionIcon}>📷</Text>
          <Text style={styles.permissionTitle}>Camera Required</Text>
          <Text style={styles.permissionSub}>Allow camera access to detect vehicles.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={requestPermission}>
            <Text style={styles.primaryBtnText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} bounces={false}>

        {/* Camera / Image */}
        <View style={styles.cameraCard}>
          {cameraActive ? (
            <CameraView ref={cameraRef} style={styles.camera} facing="back">
              <View style={styles.overlay}>
                <View style={styles.cTL} /><View style={styles.cTR} />
                <View style={styles.cBL} /><View style={styles.cBR} />
                <View style={styles.scanLabel}>
                  <Text style={styles.scanLabelText}>Point at vehicles</Text>
                </View>
              </View>
            </CameraView>
          ) : (
            capturedImage && <Image source={{ uri: capturedImage }} style={styles.camera} />
          )}
        </View>

        {/* Loading */}
        {detecting && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Analyzing frame...</Text>
          </View>
        )}

        {/* Result */}
        {result && !detecting && (
          <View style={[styles.resultCard, { borderLeftColor: result.vehicles_detected ? COLORS.success : COLORS.danger }]}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>
                {result.vehicles_detected ? '✅ Vehicles Detected' : '❌ No Vehicles Found'}
              </Text>
              <View style={[styles.resultBadge, { backgroundColor: result.vehicles_detected ? COLORS.successBg : COLORS.dangerBg }]}>
                <Text style={[styles.resultBadgeText, { color: result.vehicles_detected ? COLORS.success : COLORS.danger }]}>
                  {result.vehicles_detected ? 'DETECTED' : 'NONE'}
                </Text>
              </View>
            </View>
            {result.vehicles_detected && (
              <View style={styles.resultDetails}>
                <ResultRow label="Vehicle Count" value={result.count} />
                <ResultRow label="Types" value={result.labels?.join(', ')} />
                <ResultRow label="Confidence" value={result.confidence != null ? `${(result.confidence * 100).toFixed(1)}%` : null} />
              </View>
            )}
          </View>
        )}

        {/* Buttons */}
        <View style={styles.btnRow}>
          {cameraActive ? (
            <TouchableOpacity
              style={[styles.primaryBtn, detecting && styles.primaryBtnDisabled]}
              onPress={captureAndDetect}
              disabled={detecting}
            >
              <Text style={styles.primaryBtnText}>
                {detecting ? 'Detecting...' : '📸  Detect Vehicles'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.outlineBtn} onPress={reset}>
              <Text style={styles.outlineBtnText}>↺  Scan Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ResultRow({ label, value }) {
  return (
    <View style={styles.resultRow}>
      <Text style={styles.resultLabel}>{label}</Text>
      <Text style={styles.resultValue}>{value ?? '—'}</Text>
    </View>
  );
}

const C = 20, CT = 2;
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  permissionScreen: { flex: 1, backgroundColor: COLORS.bg, justifyContent: 'center', padding: 24 },
  permissionCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  permissionIcon: { fontSize: 52, marginBottom: 16 },
  permissionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 8 },
  permissionSub: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  container: { padding: 20, paddingBottom: 40 },
  cameraCard: { borderRadius: 16, overflow: 'hidden', backgroundColor: COLORS.textPrimary, marginBottom: 16 },
  camera: { width: '100%', height: 300 },
  overlay: { flex: 1, position: 'relative', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 16 },
  cTL: { position: 'absolute', top: 16, left: 16, width: C, height: C, borderTopWidth: CT, borderLeftWidth: CT, borderColor: COLORS.primary },
  cTR: { position: 'absolute', top: 16, right: 16, width: C, height: C, borderTopWidth: CT, borderRightWidth: CT, borderColor: COLORS.primary },
  cBL: { position: 'absolute', bottom: 40, left: 16, width: C, height: C, borderBottomWidth: CT, borderLeftWidth: CT, borderColor: COLORS.primary },
  cBR: { position: 'absolute', bottom: 40, right: 16, width: C, height: C, borderBottomWidth: CT, borderRightWidth: CT, borderColor: COLORS.primary },
  scanLabel: { backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 5 },
  scanLabelText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  loadingBox: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  loadingText: { color: COLORS.textSecondary, marginTop: 10, fontSize: 14, fontWeight: '600' },
  resultCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border, borderLeftWidth: 4 },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  resultTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  resultBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  resultBadgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  resultDetails: {},
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  resultLabel: { color: COLORS.textSecondary, fontSize: 13 },
  resultValue: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '700' },
  btnRow: { marginTop: 8 },
  primaryBtn: { backgroundColor: COLORS.primary, borderRadius: 10, padding: 16, alignItems: 'center' },
  primaryBtnDisabled: { opacity: 0.5 },
  primaryBtnText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
  outlineBtn: { borderWidth: 2, borderColor: COLORS.primary, borderRadius: 10, padding: 16, alignItems: 'center' },
  outlineBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 15 },
});