import { StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");
const isWide = width >= 768;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  scrollContent: {
    padding: isWide ? 20 : 12,
    gap: isWide ? 16 : 12,
  },

  // HUD top bar
  hud: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingBottom: isWide ? 16 : 10,
  },
  hudLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  hudDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#64748b",
  },
  hudDotLive: {
    backgroundColor: "#ea580c",
  },
  hudTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  hudSub: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 11,
    fontWeight: "600",
  },

  // Grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: isWide ? 14 : 10,
  },

  // Each camera tile
  cameraWrapper: {
    width: isWide ? "48.5%" : "100%",
    backgroundColor: "#1e293b",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  // Tile header
  tileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  tileHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  tileDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ea580c",
  },
  tileLabel: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  tileBadge: {
    backgroundColor: "rgba(234,88,12,0.15)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "rgba(234,88,12,0.3)",
  },
  tileBadgeText: {
    color: "#ea580c",
    fontSize: 10,
    fontWeight: "700",
  },

  // Camera feed area
  cameraContainer: {
    height: isWide ? 220 : 200,
    backgroundColor: "#000000",
    position: "relative",
  },

  // Overlay for non-active tiles (shows mirrored static)
  mirrorOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(15,23,42,0.6)",
  },
  mirrorIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  mirrorText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },

  // Tile footer
  tileFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "rgba(15,23,42,0.5)",
  },
  tileFooterText: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  tileVehicleCount: {
    color: "#ea580c",
    fontSize: 10,
    fontWeight: "700",
  },

  // Loading / error states
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 20,
  },
  loadingText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  errorText: {
    color: "#f87171",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
});