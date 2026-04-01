import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
export const isWide = width >= 768;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  layout: {
    flex: 1,
    flexDirection: isWide ? "row" : "column",
  },

  // ── SIDEBAR (wide) / TOP NAV BAR (mobile) ───────────────
  sidebar: {
    width: isWide ? 200 : "100%",
    minWidth: isWide ? 200 : 0,
    backgroundColor: "#0f172a",
    paddingVertical: isWide ? 24 : 12,
    paddingHorizontal: isWide ? 16 : 16,
    flexDirection: isWide ? "column" : "row",
    justifyContent: isWide ? "space-between" : "space-between",
    alignItems: isWide ? "stretch" : "center",
  },
  sidebarBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: isWide ? 36 : 0,
    paddingBottom: isWide ? 20 : 0,
    borderBottomWidth: isWide ? 1 : 0,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  brandIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#ea580c",
    justifyContent: "center",
    alignItems: "center",
  },
  brandIconText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.3,
  },
  brandSub: {
    fontSize: 9,
    color: "rgba(255,255,255,0.4)",
    fontWeight: "600",
    letterSpacing: 1,
    display: isWide ? "flex" : "none",
  },

  // Sidebar nav — hidden on mobile (use bottom tabs instead)
  sidebarNav: {
    flex: isWide ? 1 : 0,
    gap: 4,
    display: isWide ? "flex" : "none",
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  navItemActive: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  navItemIcon: { fontSize: 16 },
  navItemLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "500",
  },
  navItemLabelActive: {
    color: "#ffffff",
    fontWeight: "700",
  },

  sidebarFooter: {
    paddingTop: isWide ? 20 : 0,
    borderTopWidth: isWide ? 1 : 0,
    borderTopColor: "rgba(255,255,255,0.08)",
    display: isWide ? "flex" : "none",
  },
  roleLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.35)",
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 2,
  },
  roleValue: {
    fontSize: 13,
    color: "#ffffff",
    fontWeight: "800",
    marginBottom: 14,
  },
  logoutBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "rgba(239,68,68,0.15)",
  },
  logoutText: {
    fontSize: 12,
    color: "#f87171",
    fontWeight: "700",
  },

  // Mobile-only logout button in top bar
  mobileLogout: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "rgba(239,68,68,0.2)",
    display: isWide ? "none" : "flex",
  },
  mobileLogoutText: {
    fontSize: 12,
    color: "#f87171",
    fontWeight: "700",
  },

  // ── BOTTOM TAB BAR (mobile only) ────────────────────────
  bottomTabs: {
    flexDirection: "row",
    backgroundColor: "#0f172a",
    paddingVertical: 10,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    display: isWide ? "none" : "flex",
  },
  bottomTab: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  bottomTabIcon: { fontSize: 18 },
  bottomTabLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.45)",
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  bottomTabLabelActive: {
    color: "#ea580c",
  },

  // ── MAIN ────────────────────────────────────────────────
  main: { flex: 1 },
  mainContent: {
    padding: isWide ? 28 : 16,
    gap: isWide ? 20 : 16,
    paddingBottom: 32,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: isWide ? 15 : 13,
    fontWeight: "700",
    color: "#0f172a",
  },
  refreshBtn: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  refreshText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },

  greetingRow: { marginBottom: 4 },
  greetingLabel: {
    fontSize: 10,
    color: "#94a3b8",
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 4,
  },
  greetingText: {
    fontSize: isWide ? 26 : 20,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  greetingDesc: {
    fontSize: 13,
    color: "#94a3b8",
  },

  // Stat Cards
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: isWide ? 12 : 8,
  },
  statCard: {
    flex: 1,
    minWidth: isWide ? 100 : 90,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: isWide ? 16 : 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    alignItems: "flex-start",
  },
  statIcon: {
    fontSize: isWide ? 20 : 16,
    marginBottom: isWide ? 10 : 6,
    opacity: 0.7,
  },
  statValue: {
    fontSize: isWide ? 28 : 22,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: isWide ? 10 : 9,
    color: "#94a3b8",
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginTop: 2,
  },

  // Tabs
  tabRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: isWide ? 18 : 14,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  tabActive: {
    backgroundColor: "#ea580c",
    borderColor: "#ea580c",
  },
  tabText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "600",
  },
  tabTextActive: { color: "#ffffff" },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0f172a",
  },
  sectionCount: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
  },

  // Action Grid
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: isWide ? 14 : 10,
  },
  actionCard: {
    width: isWide ? "47%" : "47%",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: isWide ? 20 : 14,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  actionIconWrap: {
    width: isWide ? 44 : 36,
    height: isWide ? 44 : 36,
    borderRadius: 12,
    backgroundColor: "#ea580c",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: isWide ? 12 : 8,
  },
  actionIcon: { fontSize: isWide ? 22 : 18 },
  actionTitle: {
    fontSize: isWide ? 14 : 13,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: isWide ? 12 : 11,
    color: "#94a3b8",
    lineHeight: 17,
  },
});