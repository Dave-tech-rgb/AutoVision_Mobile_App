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
  logsContainer: { 
    width: "100%" 
  },
  logCard: { 
    backgroundColor: "#fff", 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 15, 
    borderLeftWidth: 5, 
    borderLeftColor: "#3498db",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logType: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#2c3e50", 
    marginBottom: 10 
  },
  logDetails: { 
    gap: 5 
  },
  logText: { 
    fontSize: 14, 
    color: "#7f8c8d" 
  },
  bold: { 
    fontWeight: "bold", 
    color: "#2c3e50" 
  },
});