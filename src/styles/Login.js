import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
export const isWide = width >= 768;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  splitLayout: {
    flex: 1,
    flexDirection: isWide ? "row" : "column",
  },

  // ── LEFT PANEL ──────────────────────────────────────────
  leftPanel: {
    flex: isWide ? 0 : 1,
    width: isWide ? 420 : "100%",
    minWidth: isWide ? 420 : 0,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    paddingHorizontal: isWide ? 48 : 28,
    paddingVertical: isWide ? 60 : 48,
    zIndex: 1,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: isWide ? 44 : 32,
  },
  brandDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ea580c",
    marginRight: 8,
  },
  brandName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#ea580c",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  // Mobile orange hero banner (replaces right panel on small screens)
  mobileHero: {
    backgroundColor: "#ea580c",
    paddingVertical: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  mobileHeroEmojis: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  mobileHeroEmoji: {
    fontSize: 28,
  },
  mobileHeroTagline: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.5,
  },
  mobileHeroSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
  },

  title: {
    fontSize: isWide ? 30 : 24,
    fontWeight: "800",
    color: "#1a0a00",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 32,
  },

  form: {
    width: "100%",
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 6,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#fff7f0",
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: "#fed7aa",
    fontSize: 14,
    color: "#1a0a00",
    outlineStyle: "none",
  },
  inputFocused: {
    borderColor: "#ea580c",
    backgroundColor: "#ffffff",
  },

  button: {
    backgroundColor: "#ea580c",
    height: 52,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    cursor: "pointer",
    shadowColor: "#ea580c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#fed7aa",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  aiStatus: {
    alignItems: "center",
    marginTop: 24,
  },
  aiText: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
  },
  aiReady: {
    color: "#16a34a",
  },

  // ── RIGHT PANEL (wide only) ──────────────────────────────
  rightPanel: {
    flex: 1,
    backgroundColor: "#ea580c",
    justifyContent: "center",
    alignItems: "center",
    padding: 48,
    display: isWide ? "flex" : "none",
  },
  heroContent: {
    alignItems: "center",
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginBottom: 48,
    width: 280,
  },
  iconCard: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  iconEmoji: {
    fontSize: 32,
  },
  heroTagline: {
    fontSize: 36,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: -1,
    lineHeight: 44,
    marginBottom: 16,
  },
  heroSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 260,
  },
});