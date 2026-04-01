import React from "react";
import { View, Text } from "react-native";
import LiveCamera from "./LiveCamera";
import styles from "../styles/CameraFeed"; 

function CameraFeed() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Camera Feed</Text>
      <View style={styles.feed}>
        <LiveCamera />
      </View>
    </View>
  );
}

export default CameraFeed;