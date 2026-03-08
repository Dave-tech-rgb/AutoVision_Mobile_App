import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform,ActivityIndicator } from "react-native";
import { useAutoVision } from "../hooks/useAutoVision";
import styles from "../styles/Login"; 

function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isModelLoading } = useAutoVision();

  const handleSubmit = () => {
    if (email && password) {
      navigation.replace("Dashboard", { user: email });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.wrapper}>
          <Text style={styles.title}>AutoVision</Text>
          <Text style={styles.subtitle}>Vehicle Detection System</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Admin Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity 
              style={[styles.button, isModelLoading && styles.buttonDisabled]} 
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Access System</Text>
            </TouchableOpacity>

            <View style={styles.aiStatus}>
              {isModelLoading ? (
                <>
                  <ActivityIndicator size="small" color="#3498db" />
                  <Text style={styles.aiText}> Initializing AI...</Text>
                </>
              ) : (
                <Text style={[styles.aiText, { color: "#27ae60" }]}>● AutoVision Ready</Text>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default Login;