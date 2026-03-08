import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", 
  },
  camera: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#2c3e50",
    fontWeight: "500",
  },
  box: {
    position: "absolute",
    borderColor: "#00FF00", 
    borderWidth: 2,
    borderRadius: 4,
    zIndex: 10,
  },
  labelContainer: {
    backgroundColor: "#00FF00",
    alignSelf: "flex-start",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderBottomRightRadius: 4,
  },
  label: {
    color: "#000",
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});