import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, SafeAreaView,
  ScrollView, StatusBar, useWindowDimensions,
} from "react-native";
import { styles } from "../styles/Dashboard";

function Dashboard({ route, navigation }) {
  const displayName = route.params?.user?.name || route.params?.user || "Admin";
  const [activeTab, setActiveTab] = useState("Overview");

  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  const stats = [
    { label: "Live Feeds",     value: "2",   icon: "🎥" },
    { label: "Detections",     value: "128", icon: "🔍" },
    { label: "Vehicles",       value: "54",  icon: "🚗" },
    { label: "Alerts",         value: "3",   icon: "⚠️" },
    { label: "Devices",        value: "4",   icon: "📡" },
  ];

  const navItems = [
    { id: "LiveCamera",       label: "Live Camera",    icon: "🎥" },
    { id: "DetectionLogs",    label: "Detection Logs", icon: "📋" },
    { id: "DeviceManagement", label: "Devices",        icon: "📡" },
    { id: "UserManagement",   label: "Users",          icon: "👥" },
  ];

  const tabs = ["Overview", "Live Feed", "Logs"];

  const quickActions = [
    { id: "LiveCamera",       icon: "🎥", title: "Live Camera",    desc: "Monitor active feeds" },
    { id: "DetectionLogs",    icon: "📋", title: "Detection Logs", desc: "Browse capture history" },
    { id: "DeviceManagement", icon: "📡", title: "Devices",        desc: "Manage camera devices" },
    { id: "UserManagement",   icon: "👥", title: "Users",          desc: "Manage system users" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <View style={[styles.layout, { flexDirection: isWide ? "row" : "column" }]}>

        {/* ── SIDEBAR / TOP NAV BAR ── */}
        <View style={[
          styles.sidebar,
          {
            width: isWide ? 200 : "100%",
            flexDirection: isWide ? "column" : "row",
            paddingVertical: isWide ? 24 : 12,
          }
        ]}>
          {/* Brand */}
          <View style={styles.sidebarBrand}>
            <View style={styles.brandIcon}>
              <Text style={styles.brandIconText}>AV</Text>
            </View>
            {isWide && (
              <View>
                <Text style={styles.brandTitle}>AutoVision</Text>
                <Text style={styles.brandSub}>DETECTION SYSTEM</Text>
              </View>
            )}
            {!isWide && <Text style={styles.brandTitle}>AutoVision</Text>}
          </View>

          {/* Sidebar nav (wide only) */}
          {isWide && (
            <View style={styles.sidebarNav}>
              {navItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.navItem, activeTab === item.label && styles.navItemActive]}
                  onPress={() => navigation.navigate(item.id)}
                >
                  <Text style={styles.navItemIcon}>{item.icon}</Text>
                  <Text style={[
                    styles.navItemLabel,
                    activeTab === item.label && styles.navItemLabelActive,
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Wide sidebar footer */}
          {isWide && (
            <View style={styles.sidebarFooter}>
              <Text style={styles.roleLabel}>CURRENT ROLE</Text>
              <Text style={styles.roleValue}>ADMIN</Text>
              <TouchableOpacity
                style={styles.logoutBtn}
                onPress={() => navigation.replace("Login")}
              >
                <Text style={styles.logoutText}>← Logout</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Mobile logout in top bar */}
          {!isWide && (
            <TouchableOpacity
              style={styles.mobileLogout}
              onPress={() => navigation.replace("Login")}
            >
              <Text style={styles.mobileLogoutText}>Logout</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── MAIN CONTENT ── */}
        <ScrollView style={styles.main} contentContainerStyle={[
          styles.mainContent,
          { padding: isWide ? 28 : 16 }
        ]}>
          <View style={styles.topBar}>
            <Text style={styles.pageTitle}>Vehicle Detection Dashboard</Text>
            <TouchableOpacity style={styles.refreshBtn}>
              <Text style={styles.refreshText}>⟳ Refresh</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.greetingRow}>
            <Text style={styles.greetingLabel}>SYSTEM OVERVIEW</Text>
            <Text style={[styles.greetingText, { fontSize: isWide ? 26 : 20 }]}>
              {getGreeting()}, {displayName} 🚗
            </Text>
            <Text style={styles.greetingDesc}>
              Monitor live feeds, review detections, and manage your devices.
            </Text>
          </View>

          <View style={styles.statsRow}>
            {stats.map((s, i) => (
              <View key={i} style={styles.statCard}>
                <Text style={styles.statIcon}>{s.icon}</Text>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.tabRow}>
            {tabs.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.tab, activeTab === t && styles.tabActive]}
                onPress={() => setActiveTab(t)}
              >
                <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <Text style={styles.sectionCount}>{quickActions.length} modules</Text>
          </View>

          <View style={styles.actionGrid}>
            {quickActions.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.actionCard}
                onPress={() => navigation.navigate(item.id)}
                activeOpacity={0.85}
              >
                <View style={styles.actionIconWrap}>
                  <Text style={styles.actionIcon}>{item.icon}</Text>
                </View>
                <Text style={styles.actionTitle}>{item.title}</Text>
                <Text style={styles.actionDesc}>{item.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* ── BOTTOM TAB BAR (mobile only) ── */}
        {!isWide && (
          <View style={styles.bottomTabs}>
            {navItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.bottomTab}
                onPress={() => navigation.navigate(item.id)}
              >
                <Text style={styles.bottomTabIcon}>{item.icon}</Text>
                <Text style={[
                  styles.bottomTabLabel,
                  activeTab === item.label && styles.bottomTabLabelActive,
                ]}>
                  {item.label.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

      </View>
    </SafeAreaView>
  );
}

export default Dashboard;