import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import CardGrid from "../components/CardGrid";
import { styles } from "../styles/Dashboard"; 

function Dashboard({ route, navigation }) {
  const displayName = route.params?.user?.name || route.params?.user || "Admin";

  const menuItems = [
    { id: "LiveCamera", title: "Live Camera", icon: "🎥" },
    { id: "DetectionLogs", title: "Detection Logs", icon: "📋" },
    { id: "DeviceManagement", title: "Devices", icon: "⚙️" },
    { id: "UserManagement", title: "Users", icon: "👥" },
  ];

  const handleLogout = () => {
    navigation.replace("Login");
  };

  const renderNavCard = (item) => (
    <TouchableOpacity 
      style={styles.navCardInternal} 
      onPress={() => navigation.navigate(item.id)}
    >
      <Text style={styles.navCardIcon}>{item.icon}</Text>
      <Text style={styles.navCardTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <View style={styles.headerTextGroup}>
            <Text style={styles.title}>AutoVision</Text>
            <Text style={styles.welcome}>Welcome, {displayName}</Text>
          </View>

          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Vehicle Detection</Text>
          <Text style={styles.description}>
            Monitor live camera feeds and view classification data in real-time.
          </Text>
        </View>

        <CardGrid 
          title="System Control"
          data={menuItems}
          renderItem={renderNavCard}
          containerStyle={styles.gridContainer}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

export default Dashboard;