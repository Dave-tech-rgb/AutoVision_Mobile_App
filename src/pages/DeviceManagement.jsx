import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { useAutoVision } from "../hooks/useAutoVision";
import LiveCamera from "./LiveCamera";
import { styles } from "../styles/DeviceManagement";

function DeviceManagement() {
  const [devices, setDevices] = useState([]);
  const { formData, handleInputChange, resetForm } = useAutoVision();
  const [search, setSearch] = useState("");

  const addDevice = () => {
    const name = formData.name || "";
    const location = formData.location || "";
    const deviceId = formData.deviceId || "camera-1";

    if (!name.trim() || !location.trim()) {
      alert("Please enter name and location!");
      return;
    }

    const device = {
      id: Date.now(),
      name,
      location,
      status: "Online",
      deviceId,
    };

    setDevices([...devices, device]);
    resetForm();
  };

  const deleteDevice = (id) => {
    setDevices(devices.filter((d) => d.id !== id));
  };

  const toggleStatus = (id) => {
    setDevices(
      devices.map((d) =>
        d.id === id ? { ...d, status: d.status === "Online" ? "Offline" : "Online" } : d
      )
    );
  };

  const filteredDevices = devices.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Device Management</Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search devices..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.formCard}>
          <TextInput
            style={styles.input}
            placeholder="Camera Name"
            value={formData.name || ""}
            onChangeText={(text) => handleInputChange({ target: { name: "name", value: text } })}
          />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={formData.location || ""}
            onChangeText={(text) => handleInputChange({ target: { name: "location", value: text } })}
          />
          <TouchableOpacity style={styles.primaryButton} onPress={addDevice}>
            <Text style={styles.primaryButtonText}>Add Camera</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {filteredDevices.map((device) => (
            <View key={device.id} style={styles.deviceCard}>
              <Text style={styles.deviceTitle}>{device.name}</Text>
              <Text style={styles.deviceText}>Location: {device.location}</Text>
              
              <View style={styles.statusRow}>
                <Text style={styles.deviceText}>Status: </Text>
                <View style={[
                  styles.statusDot, 
                  device.status === "Online" ? styles.statusOnline : styles.statusOffline
                ]} />
                <Text style={styles.deviceText}>{device.status}</Text>
              </View>

              {device.status === "Online" && (
                <View style={styles.cameraContainer}>
                  <LiveCamera />
                </View>
              )}

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.toggleButton} onPress={() => toggleStatus(device.id)}>
                  <Text style={styles.buttonText}>Toggle</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteDevice(device.id)}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default DeviceManagement;