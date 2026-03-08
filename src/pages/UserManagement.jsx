import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { useAutoVision } from "../hooks/useAutoVision";
import { styles } from "../styles/UserManagement";

const ROLES = ["Admin", "Operator", "Viewer"];

function UserManagement() {
  const { formData, handleInputChange, resetForm } = useAutoVision();
  const [users, setUsers] = useState([
    { id: 1, name: "Tyler", role: "Admin" },
    { id: 2, name: "Dr. Robinson", role: "Operator" },
  ]);
  const [auditLog, setAuditLog] = useState([]);

  const addLogEntry = (action, userName, role) => {
    const entry = {
      action,
      user: userName,
      role: role,
      time: new Date().toLocaleTimeString(),
    };
    setAuditLog((prev) => [entry, ...prev]);
  };

  const addUser = () => {
    if (!formData.newName?.trim()) return;
    const newUser = {
      id: Date.now(),
      name: formData.newName,
      role: formData.newRole || "Viewer",
    };
    setUsers([...users, newUser]);
    addLogEntry("Add User", newUser.name, newUser.role);
    resetForm();
  };

  const removeUser = (id) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    setUsers(users.filter((u) => u.id !== id));
    addLogEntry("Remove User", target.name, target.role);
  };

  const cycleRole = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const nextRole = ROLES[(ROLES.indexOf(u.role) + 1) % ROLES.length];
        addLogEntry("Change Role", u.name, nextRole);
        return { ...u, role: nextRole };
      }
      return u;
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>User Management</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Add User</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter name"
            value={formData.newName || ""}
            onChangeText={(text) => handleInputChange({ target: { name: "newName", value: text } })}
          />
          <View style={styles.roleSelector}>
            <Text>Role:</Text>
            {ROLES.map(role => (
              <TouchableOpacity
                key={role}
                style={[
                  styles.roleOption, 
                  (formData.newRole || "Viewer") === role && styles.roleOptionActive
                ]}
                onPress={() => handleInputChange({ target: { name: "newRole", value: role } })}
              >
                <Text style={(formData.newRole || "Viewer") === role ? styles.roleTextActive : styles.roleText}>
                  {role}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.primaryButton} onPress={addUser}>
            <Text style={styles.primaryButtonText}>Add User</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeader}>User List</Text>
        {users.map(user => (
          <View key={user.id} style={styles.userRow}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <TouchableOpacity onPress={() => cycleRole(user.id)} style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>{user.role}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => removeUser(user.id)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}

        <Text style={styles.sectionHeader}>System Audit Trail</Text>
        <View style={styles.auditLog}>
          {auditLog.length === 0 ? (
            <Text style={styles.emptyLog}>No recent activity.</Text>
          ) : (
            auditLog.map((log, idx) => (
              <View key={idx} style={styles.logEntry}>
                <Text style={styles.logTime}>[{log.time}]</Text>
                <Text style={styles.logText} numberOfLines={2}>
                  <Text style={styles.boldText}>{log.action}: </Text>
                  {log.user} assigned as {log.role}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default UserManagement;