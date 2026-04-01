import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, SafeAreaView,
  KeyboardAvoidingView, Platform, ActivityIndicator,
  StatusBar, ScrollView, useWindowDimensions,
} from "react-native";
import { useAutoVision } from "../hooks/useAutoVision";
import styles from "../styles/Login";

function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { isModelLoading } = useAutoVision();

  // Live responsive — reacts to rotation & resize
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const handleSubmit = () => {
    if (email && password) {
      navigation.replace("Dashboard", { user: email });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={[styles.splitLayout, { flexDirection: isWide ? "row" : "column" }]}>

        {/* ── MOBILE ONLY: Orange hero banner at top ── */}
        {!isWide && (
          <View style={styles.mobileHero}>
            <View style={styles.mobileHeroEmojis}>
              {["🚗", "🚙", "🏎️"].map((e, i) => (
                <Text key={i} style={styles.mobileHeroEmoji}>{e}</Text>
              ))}
            </View>
            <Text style={styles.mobileHeroTagline}>AutoVision</Text>
            <Text style={styles.mobileHeroSub}>Real-time vehicle detection</Text>
          </View>
        )}

        {/* ── LEFT: Form Panel ── */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={[
            styles.leftPanel,
            {
              width: isWide ? 420 : "100%",
              paddingHorizontal: isWide ? 48 : 28,
              paddingVertical: isWide ? 60 : 36,
              flex: isWide ? 0 : 1,
            },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Brand — only show on wide */}
            {isWide && (
              <View style={styles.brandRow}>
                <View style={styles.brandDot} />
                <Text style={styles.brandName}>AutoVision</Text>
              </View>
            )}

            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Enter your credentials to access the system.
            </Text>

            <View style={styles.form}>
              <Text style={styles.label}>Admin Email</Text>
              <TextInput
                style={[styles.input, emailFocused && styles.inputFocused]}
                placeholder="Enter your email"
                placeholderTextColor="#c4c4c4"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[styles.input, passwordFocused && styles.inputFocused]}
                placeholder="Enter your password"
                placeholderTextColor="#c4c4c4"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />

              <TouchableOpacity
                style={[
                  styles.button,
                  (!email || !password || isModelLoading) && styles.buttonDisabled,
                ]}
                onPress={handleSubmit}
                activeOpacity={0.85}
                disabled={!email || !password || isModelLoading}
              >
                {isModelLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>Access System</Text>
                )}
              </TouchableOpacity>

              <View style={styles.aiStatus}>
                {isModelLoading ? (
                  <Text style={styles.aiText}>⏳ Initializing AI Model...</Text>
                ) : (
                  <Text style={[styles.aiText, styles.aiReady]}>
                    ● AutoVision AI Ready
                  </Text>
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* ── RIGHT: Hero Panel (wide only) ── */}
        {isWide && (
          <View style={styles.rightPanel}>
            <View style={styles.heroContent}>
              <View style={styles.iconGrid}>
                {["🚗", "🚙", "🚕", "🚌", "🏎️", "🚐"].map((icon, i) => (
                  <View key={i} style={[styles.iconCard, { opacity: 0.6 + i * 0.07 }]}>
                    <Text style={styles.iconEmoji}>{icon}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.heroTagline}>Detect. Identify.{"\n"}Analyze.</Text>
              <Text style={styles.heroSub}>
                Real-time vehicle detection powered by on-device AI.
              </Text>
            </View>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
}

export default Login;