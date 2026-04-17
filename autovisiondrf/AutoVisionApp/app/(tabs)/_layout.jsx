import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Alert,
} from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { usePathname, router } from 'expo-router';
import { useAuth } from '../../store/authStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { COLORS } from '../../styles/Theme';

const NAV_ITEMS = [
  { name: 'dashboard', label: 'Dashboard',      icon: '🏠' },
  { name: 'detect',    label: 'Live Camera',    icon: '📷' },
  { name: 'devices',   label: 'Devices',        icon: '📡' },
  { name: 'logs',      label: 'Detection Logs', icon: '📋' },
  { name: 'users',     label: 'Users',          icon: '👤' },
];

function CustomDrawerContent() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const isActive = (name) => pathname.includes(name);

  return (
    <SafeAreaView style={styles.safe}>

      <View style={styles.logoArea}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>AV</Text>
        </View>
        <View>
          <Text style={styles.brandName}>AutoVision</Text>
          <Text style={styles.brandSub}>DETECTION SYSTEM</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <ScrollView style={styles.navList} showsVerticalScrollIndicator={false}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.name);
          return (
            <TouchableOpacity
              key={item.name}
              style={[styles.navItem, active && styles.navItemActive]}
              onPress={() => router.push(`/(tabs)/${item.name}`)}
              activeOpacity={0.7}
            >
              <Text style={[styles.navIcon, active && styles.navIconActive]}>
                {item.icon}
              </Text>
              <Text style={[styles.navLabel, active && styles.navLabelActive]}>
                {item.label}
              </Text>
              {active && <View style={styles.activeBar} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.bottomArea}>
        <View style={styles.divider} />
        <View style={styles.roleBox}>
          <Text style={styles.roleLabel}>CURRENT ROLE</Text>
          <Text style={styles.roleValue}>
            {user?.is_staff ? 'ADMIN' : 'STAFF'}
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={() => <CustomDrawerContent />}
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '800', color: '#FFFFFF', fontSize: 16 },
          headerShadowVisible: false,
          drawerStyle: { backgroundColor: COLORS.sidebar, width: 220 },
          swipeEdgeWidth: 60,
          sceneContainerStyle: { backgroundColor: COLORS.bg },
        }}
      >
        <Drawer.Screen name="dashboard" options={{ title: 'Dashboard' }} />
        <Drawer.Screen name="detect"    options={{ title: 'Live Camera' }} />
        <Drawer.Screen name="devices"   options={{ title: 'Devices' }} />
        <Drawer.Screen name="logs"      options={{ title: 'Detection Logs' }} />
        <Drawer.Screen name="users"     options={{ title: 'Users' }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  logoArea: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 20,
  },
  logoBox: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  logoText: { color: '#FFF', fontWeight: '900', fontSize: 14 },
  brandName: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  brandSub: { fontSize: 9, color: COLORS.textMuted, letterSpacing: 1, marginTop: 1 },
  divider: { height: 1, backgroundColor: COLORS.border },
  navList: { flex: 1, paddingTop: 8 },
  navItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 13, paddingHorizontal: 20, position: 'relative',
  },
  navItemActive: { backgroundColor: '#FFF5F0' },
  navIcon: { fontSize: 16, marginRight: 12, opacity: 0.45 },
  navIconActive: { opacity: 1 },
  navLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, flex: 1 },
  navLabelActive: { color: COLORS.primary, fontWeight: '700' },
  activeBar: {
    position: 'absolute', right: 0, top: 6, bottom: 6,
    width: 3, backgroundColor: COLORS.primary, borderRadius: 2,
  },
  bottomArea: { paddingBottom: 16 },
  roleBox: { paddingHorizontal: 20, paddingVertical: 12 },
  roleLabel: { fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 2 },
  roleValue: { fontSize: 13, fontWeight: '800', color: COLORS.textPrimary },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
  logoutIcon: { fontSize: 15, marginRight: 10 },
  logoutText: { fontSize: 13, fontWeight: '600', color: COLORS.danger },
});