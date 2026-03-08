import React from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { styles } from "../styles/DetectionLog"; 

function DetectionLogs() {
  const logs = [
    { id: 1, type: "Car", confidence: "92%", date: "Feb 20, 2026", time: "6:15 PM" },
    { id: 2, type: "Motorcycle", confidence: "88%", date: "Feb 20, 2026", time: "6:17 PM" },
    { id: 3, type: "Truck", confidence: "95%", date: "Feb 20, 2026", time: "6:19 PM" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Detection Logs</Text>

        <View style={styles.logsContainer}>
          {logs.map((log) => (
            <View key={log.id} style={styles.logCard}>
              <Text style={styles.logType}>{log.type}</Text>
              <View style={styles.logDetails}>
                <Text style={styles.logText}>
                  Confidence: <Text style={styles.bold}>{log.confidence}</Text>
                </Text>
                <Text style={styles.logText}>Date: {log.date}</Text>
                <Text style={styles.logText}>Time: {log.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default DetectionLogs;