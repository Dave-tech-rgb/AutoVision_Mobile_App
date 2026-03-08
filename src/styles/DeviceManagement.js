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
  searchContainer: { 
    marginBottom: 20 
  },
  formCard: { 
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
  input: { 
    borderWidth: 1, 
    borderColor: "#ddd", 
    padding: 10, 
    borderRadius: 5, 
    marginBottom: 15, 
    backgroundColor: "#fff",
    color: "#333"
  },
  primaryButton: { 
    backgroundColor: "#3498db", 
    padding: 15, 
    borderRadius: 5, 
    alignItems: "center" 
  },
  primaryButtonText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
  grid: { 
    gap: 15 
  },
  deviceCard: { 
    backgroundColor: "#fff", 
    padding: 15, 
    borderRadius: 10, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 2, 
    marginBottom: 15 
  },
  deviceTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 5, 
    color: "#2c3e50" 
  },
  deviceText: { 
    fontSize: 14, 
    color: "#7f8c8d", 
    marginBottom: 5 
  },
  statusRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 10 
  },
  statusDot: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    marginRight: 5 
  },
  statusOnline: { 
    backgroundColor: "#2ecc71" 
  },
  statusOffline: { 
    backgroundColor: "#e74c3c" 
  },
  cameraContainer: { 
    height: 200, 
    backgroundColor: "#000", 
    borderRadius: 8, 
    overflow: "hidden", 
    marginBottom: 15 
  },
  actionRow: { 
    flexDirection: "row", 
    justifyContent: "space-between" 
  },
  toggleButton: { 
    backgroundColor: "#f39c12", 
    padding: 10, 
    borderRadius: 5, 
    flex: 0.48, 
    alignItems: "center" 
  },
  deleteButton: { 
    backgroundColor: "#e74c3c", 
    padding: 10, 
    borderRadius: 5, 
    flex: 0.48, 
    alignItems: "center" 
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
});