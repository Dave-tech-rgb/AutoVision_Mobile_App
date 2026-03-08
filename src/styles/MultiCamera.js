import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f5" 
  },
  scrollContent: { 
    padding: 10 
  },
  grid: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "space-between" 
  },
  cameraWrapper: { 
    width: "48%", 
    marginBottom: 15, 
    backgroundColor: "#fff", 
    padding: 5, 
    borderRadius: 8,

    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  label: { 
    fontWeight: "bold", 
    textAlign: "center", 
    marginBottom: 5,
    color: "#2c3e50"
  },
  cameraContainer: { 
    height: 150, 
    backgroundColor: "#000", 
    borderRadius: 5, 
    overflow: "hidden" 
  },
});