import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between", // Pushes text left and button right
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTextGroup: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  welcome: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: "#e74c3c", // Switched to red for better visibility
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  content: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: "#3498db", // Adds a nice accent line
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#34495e",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#7f8c8d",
    lineHeight: 20,
  },
  gridContainer: {
    marginTop: 10,
  },
  // Internal card content for CardGrid
  navCardInternal: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 10,
  },
  navCardIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  navCardTitle: {
    color: "#2c3e50",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});