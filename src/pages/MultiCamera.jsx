import React from "react";
import { View, SafeAreaView, ScrollView, Text } from "react-native";
import LiveCamera from "./LiveCamera";
import { styles } from "../styles/MultiCamera";

function MultiCamera() {
  const locations = ["Puerto", "Cugman", "Bukidnon", "Lapasan"];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {locations.map((loc, index) => (
            <View key={index} style={styles.cameraWrapper}>
              <Text style={styles.label}>{loc}</Text>
              <View style={styles.cameraContainer}>
                <LiveCamera />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default MultiCamera;