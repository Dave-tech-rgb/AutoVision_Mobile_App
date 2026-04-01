import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  centered: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 12,
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 12,
    textAlign: "center",
  },
  loadingSubText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    textAlign: "center",
  },

  // HUD
  hud: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(15,23,42,0.85)",
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
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  hudCount: {
    color: "#ea580c",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // Native camera
  camera: {
    flex: 1,
    width: "100%",
  },

  // Web camera container
  webCameraContainer: {
    flex: 1,
    position: "relative",
    backgroundColor: "#000000",
    marginTop: 44, // HUD height
  },

  // Native bounding boxes
  box: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "#ea580c",
    borderRadius: 4,
  },
  labelContainer: {
    position: "absolute",
    top: -24,
    left: -2,
    backgroundColor: "#ea580c",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  label: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // No detection
  noDetection: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    backgroundColor: "rgba(15,23,42,0.85)",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    zIndex: 10,
  },
  noDetectionText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontWeight: "600",
  },

  // Class tags at bottom
  classRow: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    flexDirection: "row",
    gap: 8,
    zIndex: 10,
  },
  classTag: {
    backgroundColor: "rgba(234,88,12,0.15)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(234,88,12,0.35)",
  },
  classTagText: {
    color: "#ea580c",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Permission denied / error
  webFallbackIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  webFallbackTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  webFallbackSub: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 300,
    marginTop: 8,
  },
});