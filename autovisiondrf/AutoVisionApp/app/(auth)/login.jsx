import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, Alert, StyleSheet,
  KeyboardAvoidingView, Platform, SafeAreaView, ScrollView,
} from 'react-native';
import { useAuth } from '../../store/authStore';
import { router } from 'expo-router';
import { API_BASE } from '../../services/api';

export default function LoginScreen() {
  const { login } = useAuth();
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetFields = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
  };

  const switchMode = (m) => { resetFields(); setMode(m); };

  // ── Login ────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter username and password.');
      return;
    }
    setLoading(true);
    try {
      await login(username.trim(), password);
      router.replace('/(tabs)/dashboard');
    } catch (err) {
      if (err.message === 'Network request failed') {
        Alert.alert(
          'Connection Error',
          `Cannot reach server at:\n${API_BASE}\n\nMake sure:\n• Django is running\n• Correct IP in api.js\n• Same WiFi network`
        );
      } else {
        Alert.alert('Login Failed', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Register ─────────────────────────────────────────────────
  const handleRegister = async () => {
    if (!username.trim()) { Alert.alert('Error', 'Username is required.'); return; }
    if (!password.trim()) { Alert.alert('Error', 'Password is required.'); return; }
    if (password !== confirmPassword) { Alert.alert('Error', 'Passwords do not match.'); return; }
    if (password.length < 6) { Alert.alert('Error', 'Password must be at least 6 characters.'); return; }

    setLoading(true);

    try {
      // 10 second timeout
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);

      let res;
      try {
        res = await fetch(`${API_BASE}/register/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username.trim(),
            email: email.trim(),
            password,
          }),
          signal: controller.signal,
        });
      } catch (fetchErr) {
        clearTimeout(timer);
        if (fetchErr.name === 'AbortError') {
          throw new Error(`TIMEOUT`);
        }
        throw new Error(`NETWORK`);
      }

      clearTimeout(timer);

      // Parse response safely
      let data = {};
      try {
        data = await res.json();
      } catch {
        throw new Error(`Server returned status ${res.status} with no valid response.`);
      }

      if (!res.ok) {
        const msg = Object.values(data).flat().join('\n');
        throw new Error(msg || `Server error ${res.status}`);
      }

      Alert.alert(
        '✅ Account Created',
        `Welcome, ${data.username}!\nYou can now sign in.`,
        [{ text: 'Sign In', onPress: () => switchMode('login') }]
      );

    } catch (err) {
      if (err.message === 'TIMEOUT') {
        Alert.alert(
          'Timeout',
          `Server took too long.\n\nServer: ${API_BASE}\n\nMake sure Django is running with:\npython manage.py runserver 0.0.0.0:8000`
        );
      } else if (err.message === 'NETWORK' || err.message === 'Network request failed') {
        Alert.alert(
          'Connection Error',
          `Cannot reach:\n${API_BASE}\n\nCheck:\n• Django is running\n• IP address is correct\n• Phone & PC on same WiFi`
        );
      } else {
        Alert.alert('Registration Failed', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoArea}>
            <View style={styles.logoBox}>
              <Text style={styles.logoBoxText}>AV</Text>
            </View>
            <Text style={styles.logoTitle}>AutoVision</Text>
            <Text style={styles.logoSub}>Vehicle Detection System</Text>
          </View>

          {/* Mode Toggle */}
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'login' && styles.modeBtnActive]}
              onPress={() => switchMode('login')}
            >
              <Text style={[styles.modeBtnText, mode === 'login' && styles.modeBtnTextActive]}>
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'register' && styles.modeBtnActive]}
              onPress={() => switchMode('register')}
            >
              <Text style={[styles.modeBtnText, mode === 'register' && styles.modeBtnTextActive]}>
                Register
              </Text>
            </TouchableOpacity>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </Text>
            <Text style={styles.cardSub}>
              {mode === 'login'
                ? 'Sign in to your AutoVision account'
                : 'Fill in the details below to get started'}
            </Text>

            {/* Username */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter username"
                placeholderTextColor="#9CA3AF"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Email - register only */}
            {mode === 'register' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Email <Text style={styles.optional}>(optional)</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="user@email.com"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            )}

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Enter password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword((v) => !v)}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password - register only */}
            {mode === 'register' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter password"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
              </View>
            )}

            {/* Submit */}
            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={mode === 'login' ? handleLogin : handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#FFF" size="small" />
                  <Text style={[styles.submitBtnText, { marginLeft: 8 }]}>
                    {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                  </Text>
                </View>
              ) : (
                <Text style={styles.submitBtnText}>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Switch */}
            <TouchableOpacity
              onPress={() => switchMode(mode === 'login' ? 'register' : 'login')}
              style={styles.switchBtn}
              disabled={loading}
            >
              <Text style={styles.switchText}>
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <Text style={styles.switchTextBold}>
                  {mode === 'login' ? 'Register' : 'Sign In'}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.serverInfo}>Server: {API_BASE}</Text>
          <Text style={styles.footer}>AutoVision © 2025</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const PRIMARY = '#E8500A';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F4F5F7' },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoArea: { alignItems: 'center', marginBottom: 32 },
  logoBox: { width: 64, height: 64, borderRadius: 16, backgroundColor: PRIMARY, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  logoBoxText: { color: '#FFF', fontSize: 22, fontWeight: '900' },
  logoTitle: { fontSize: 26, fontWeight: '900', color: '#1A1A2E', letterSpacing: 1 },
  logoSub: { fontSize: 12, color: '#9CA3AF', marginTop: 4, letterSpacing: 0.5 },
  modeToggle: { flexDirection: 'row', backgroundColor: '#E5E7EB', borderRadius: 12, padding: 4, marginBottom: 20 },
  modeBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  modeBtnActive: { backgroundColor: PRIMARY },
  modeBtnText: { color: '#6B7280', fontWeight: '700', fontSize: 14 },
  modeBtnTextActive: { color: '#FFF' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#E5E7EB' },
  cardTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A2E', marginBottom: 4 },
  cardSub: { fontSize: 13, color: '#6B7280', marginBottom: 20, lineHeight: 18 },
  inputGroup: { marginBottom: 16 },
  label: { color: '#6B7280', fontSize: 13, fontWeight: '600', marginBottom: 6 },
  optional: { color: '#9CA3AF', fontWeight: '400' },
  input: { backgroundColor: '#F4F5F7', borderRadius: 10, padding: 13, color: '#1A1A2E', fontSize: 14, borderWidth: 1, borderColor: '#E5E7EB' },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  eyeBtn: { padding: 13, backgroundColor: '#F4F5F7', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', marginLeft: 8 },
  eyeIcon: { fontSize: 16 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  submitBtn: { backgroundColor: PRIMARY, borderRadius: 10, padding: 15, alignItems: 'center', marginTop: 4, marginBottom: 16 },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
  switchBtn: { alignItems: 'center', paddingVertical: 4 },
  switchText: { color: '#6B7280', fontSize: 13 },
  switchTextBold: { color: PRIMARY, fontWeight: '700' },
  serverInfo: { color: '#9CA3AF', textAlign: 'center', marginTop: 20, fontSize: 10 },
  footer: { color: '#D1D5DB', textAlign: 'center', marginTop: 4, fontSize: 12 },
});