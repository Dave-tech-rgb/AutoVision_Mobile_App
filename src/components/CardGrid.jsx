import React from "react";
import { View, Text, StyleSheet } from "react-native";

function CardGrid({
  title,
  data,
  renderItem,
  emptyMessage = "No data available.",
  containerStyle,
}) {
  return (
    <View style={[styles.section, containerStyle]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}

      <View style={styles.grid}>
        {data.length === 0 ? (
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        ) : (
          data.map((item, index) => (
            <View key={item.id || index} style={styles.card}>
              {renderItem(item)}
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginVertical: 10,
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default CardGrid;