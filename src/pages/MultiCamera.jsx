import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, SafeAreaView, ScrollView,
  ActivityIndicator, Platform, useWindowDimensions,
} from "react-native";
import * as tf from "@tensorflow/tfjs";
import { styles } from "../styles/MultiCamera";

// Native-only imports
let Camera = null;
let cameraWithTensors = null;
let cocoSsdModule = null;
let TensorCamera = null;

if (Platform.OS !== "web") {
  Camera = require("expo-camera").Camera;
  cameraWithTensors = require("@tensorflow/tfjs-react-native").cameraWithTensors;
  cocoSsdModule = require("@tensorflow-models/coco-ssd");
  TensorCamera = cameraWithTensors(Camera);
}

const LOCATIONS = ["Puerto", "Cugman", "Bukidnon", "Lapasan"];
const VEHICLE_CLASSES = ["car", "truck", "bus", "motorcycle"];

// ── Single shared detection state per tile ────────────────
function useSingleCamera(model, isTfReady) {
  const [hasPermission, setHasPermission] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!isTfReady || !model) return;

    if (Platform.OS === "web") {
      startWebCam();
    } else {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      })();
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, [isTfReady, model]);

  const startWebCam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 640, height: 480 },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setHasPermission(true);
          runWebDetection();
        };
      }
    } catch {
      setHasPermission(false);
    }
  };

  const runWebDetection = () => {
    setIsDetecting(true);
    const loop = async () => {
      if (!videoRef.current || !model) return;
      try {
        const preds = await model.detect(videoRef.current);
        const vehicles = preds.filter(p => VEHICLE_CLASSES.includes(p.class));
        setPredictions(vehicles);

        // Draw on canvas
        const canvas = canvasRef.current;
        if (canvas && videoRef.current) {
          const ctx = canvas.getContext("2d");
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          vehicles.forEach(p => {
            const [x, y, w, h] = p.bbox;
            ctx.strokeStyle = "#ea580c";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, w, h);
            ctx.fillStyle = "#ea580c";
            ctx.fillRect(x - 1, y - 22, w + 2, 22);
            ctx.fillStyle = "#fff";
            ctx.font = "bold 11px monospace";
            ctx.fillText(`${p.class.toUpperCase()} ${Math.round(p.score * 100)}%`, x + 4, y - 6);
          });
        }
      } catch (e) {
        console.warn("Detection error:", e);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();
  };

  const handleNativeStream = (images) => {
    setIsDetecting(true);
    const loop = async () => {
      if (model) {
        const tensor = images.next().value;
        if (tensor) {
          try {
            const preds = await model.detect(tensor);
            setPredictions(preds.filter(p => VEHICLE_CLASSES.includes(p.class)));
          } catch (e) {
            console.warn(e);
          } finally {
            tf.dispose(tensor);
          }
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();
  };

  return { hasPermission, predictions, isDetecting, videoRef, canvasRef, handleNativeStream };
}

// ── Single live tile (primary camera) ────────────────────
function LiveTile({ location, model, isTfReady, isWide }) {
  const {
    hasPermission, predictions, isDetecting,
    videoRef, canvasRef, handleNativeStream,
  } = useSingleCamera(model, isTfReady);

  const vehicleCount = predictions.length;

  const renderContent = () => {
    if (!isTfReady || !model) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="small" color="#ea580c" />
          <Text style={styles.loadingText}>Loading model...</Text>
        </View>
      );
    }

    if (hasPermission === false) {
      return (
        <View style={styles.centered}>
          <Text style={{ fontSize: 22 }}>🚫</Text>
          <Text style={styles.errorText}>Camera denied</Text>
        </View>
      );
    }

    if (Platform.OS === "web") {
      return (
        <View style={{ flex: 1, position: "relative" }}>
          <video
            ref={videoRef}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            autoPlay playsInline muted
          />
          <canvas
            ref={canvasRef}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          />
        </View>
      );
    }

    // Native
    if (hasPermission && TensorCamera) {
      return (
        <TensorCamera
          style={{ flex: 1, width: "100%" }}
          type={Camera.Constants?.Type?.back ?? "back"}
          cameraTextureHeight={1920}
          cameraTextureWidth={1080}
          resizeHeight={200}
          resizeWidth={152}
          resizeDepth={3}
          onReady={handleNativeStream}
          autorender={true}
        />
      );
    }

    return (
      <View style={styles.centered}>
        <ActivityIndicator size="small" color="#ea580c" />
        <Text style={styles.loadingText}>Initializing camera...</Text>
      </View>
    );
  };

  return (
    <View style={[styles.cameraWrapper, { width: isWide ? "48.5%" : "100%" }]}>
      <View style={styles.tileHeader}>
        <View style={styles.tileHeaderLeft}>
          <View style={[styles.tileDot, !isDetecting && { backgroundColor: "#64748b" }]} />
          <Text style={styles.tileLabel}>{location}</Text>
        </View>
        <View style={styles.tileBadge}>
          <Text style={styles.tileBadgeText}>
            {isDetecting ? "LIVE" : "LOADING"}
          </Text>
        </View>
      </View>

      <View style={styles.cameraContainer}>
        {renderContent()}
      </View>

      <View style={styles.tileFooter}>
        <Text style={styles.tileFooterText}>CAM-{Math.floor(Math.random() * 9000) + 1000}</Text>
        <Text style={styles.tileVehicleCount}>
          {vehicleCount} vehicle{vehicleCount !== 1 ? "s" : ""}
        </Text>
      </View>
    </View>
  );
}

// ── Mirror tile (clones primary feed visually) ────────────
function MirrorTile({ location, isWide }) {
  return (
    <View style={[styles.cameraWrapper, { width: isWide ? "48.5%" : "100%" }]}>
      <View style={styles.tileHeader}>
        <View style={styles.tileHeaderLeft}>
          <View style={[styles.tileDot, { backgroundColor: "#64748b" }]} />
          <Text style={styles.tileLabel}>{location}</Text>
        </View>
        <View style={[styles.tileBadge, { borderColor: "rgba(100,116,139,0.3)", backgroundColor: "rgba(100,116,139,0.1)" }]}>
          <Text style={[styles.tileBadgeText, { color: "#64748b" }]}>STANDBY</Text>
        </View>
      </View>

      <View style={styles.cameraContainer}>
        <View style={styles.mirrorOverlay}>
          <Text style={styles.mirrorIcon}>📡</Text>
          <Text style={styles.mirrorText}>
            Feed relay from{"\n"}primary camera
          </Text>
        </View>
      </View>

      <View style={styles.tileFooter}>
        <Text style={styles.tileFooterText}>RELAY MODE</Text>
        <Text style={[styles.tileVehicleCount, { color: "#64748b" }]}>— vehicles</Text>
      </View>
    </View>
  );
}

// ── Main MultiCamera screen ───────────────────────────────
function MultiCamera() {
  const [model, setModel] = useState(null);
  const [isTfReady, setIsTfReady] = useState(false);
  const [loadingStep, setLoadingStep] = useState("Initializing TensorFlow...");
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  useEffect(() => {
    (async () => {
      setLoadingStep("Initializing TensorFlow...");
      await tf.ready();
      setIsTfReady(true);
      setLoadingStep("Loading COCO-SSD model...");
      const cocoSsd = await import("@tensorflow-models/coco-ssd");
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
    })();
  }, []);

  if (!isTfReady || !model) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.centered, { flex: 1 }]}>
          <ActivityIndicator size="large" color="#ea580c" />
          <Text style={[styles.loadingText, { fontSize: 13, color: "#fff", marginTop: 12 }]}>
            {loadingStep}
          </Text>
          <Text style={[styles.loadingText, { marginTop: 4 }]}>
            AutoVision AI warming up...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* HUD */}
        <View style={styles.hud}>
          <View style={styles.hudLeft}>
            <View style={[styles.hudDot, styles.hudDotLive]} />
            <Text style={styles.hudTitle}>MULTI-CAM VIEW</Text>
          </View>
          <Text style={styles.hudSub}>{LOCATIONS.length} locations monitored</Text>
        </View>

        {/* Grid — 1 live tile + 3 mirror tiles */}
        <View style={styles.grid}>
          {LOCATIONS.map((loc, index) =>
            index === 0 ? (
              // Only the first tile gets a real camera
              <LiveTile
                key={loc}
                location={loc}
                model={model}
                isTfReady={isTfReady}
                isWide={isWide}
              />
            ) : (
              // Rest show relay/standby UI
              <MirrorTile
                key={loc}
                location={loc}
                isWide={isWide}
              />
            )
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

export default MultiCamera;