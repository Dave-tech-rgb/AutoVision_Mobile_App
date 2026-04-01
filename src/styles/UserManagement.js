import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f5" 
  },
  scrollContent: { 
    padding: 20 
  },
  header: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20, 
    color: "#2c3e50" 
  },
  card: { 
    backgroundColor: "#fff", 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 15 
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#ddd", 
    padding: 10, 
    borderRadius: 5, 
    marginBottom: 15,
    backgroundColor: "#fff"
  },
  roleSelector: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 15, 
    flexWrap: "wrap" 
  },
  roleOption: { 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 15, 
    backgroundColor: "#eee", 
    marginLeft: 10, 
    marginBottom: 5 
  },
  roleOptionActive: { 
    backgroundColor: "#3498db" 
  },
  roleText: { 
    color: "#333" 
  },
  roleTextActive: { 
    color: "#fff" 
  },
  primaryButton: { 
    backgroundColor: "#2ecc71", 
    padding: 15, 
    borderRadius: 5, 
    alignItems: "center" 
  },
  primaryButtonText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
  sectionHeader: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginTop: 10, 
    marginBottom: 15, 
    color: "#2c3e50" 
  },
  userRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    backgroundColor: "#fff", 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 10,
    elevation: 1 
  },
  userInfo: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  userName: { 
    fontSize: 16, 
    fontWeight: "bold", 
    minWidth: 100 
  },
  roleBadge: { 
    backgroundColor: "#f39c12", 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 4, 
    marginLeft: 10 
  },
  roleBadgeText: { 
    color: "#fff", 
    fontSize: 12, 
    fontWeight: "bold" 
  },
  removeButton: { 
    backgroundColor: "#e74c3c", 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 4 
  },
  removeButtonText: { 
    color: "#fff", 
    fontSize: 12 
  },
  auditLog: { 
    backgroundColor: "#fff", 
    padding: 15, 
    borderRadius: 10,
    marginBottom: 30 
  },
  emptyLog: { 
    color: "#7f8c8d", 
    fontStyle: "italic" 
  },
  logEntry: { 
    flexDirection: "row", 
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 4
  },
  logTime: { 
    color: "#95a5a6", 
    marginRight: 8, 
    fontSize: 11 
  },
  logText: { 
    color: "#34495e", 
    fontSize: 12, 
    flex: 1 
  },
  boldText: { 
    fontWeight: "bold" 
  },
});