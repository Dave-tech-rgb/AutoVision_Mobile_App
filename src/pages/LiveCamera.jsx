import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, ActivityIndicator, Platform
} from "react-native";
import * as tf from "@tensorflow/tfjs";
import { styles } from "../styles/LiveCamera";

// Native-only imports
let Camera = null;
let cameraWithTensors = null;
let cocoSsd = null;
let TensorCamera = null;

if (Platform.OS !== "web") {
  Camera = require("expo-camera").Camera;
  cameraWithTensors = require("@tensorflow/tfjs-react-native").cameraWithTensors;
  cocoSsd = require("@tensorflow-models/coco-ssd");
  TensorCamera = cameraWithTensors(Camera);
}

const VEHICLE_CLASSES = ["car", "truck", "bus", "motorcycle"];

function LiveCamera() {
  const [hasPermission, setHasPermission] = useState(null);
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isTfReady, setIsTfReady] = useState(false);
  const [loadingStep, setLoadingStep] = useState("Initializing...");
  const [isDetecting, setIsDetecting] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState({ width: 1, height: 1 });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const streamRef = useRef(null);

  // ── SHARED: Init TF + model ───────────────────────────────
  const initTF = async () => {
    setLoadingStep("Initializing TensorFlow...");
    await tf.ready();
    setIsTfReady(true);
    setLoadingStep("Loading vehicle detection model...");
    const cocoSsdModule = await import("@tensorflow-models/coco-ssd");
    const loadedModel = await cocoSsdModule.load();
    setModel(loadedModel);
  };

  // ── WEB: Start webcam ─────────────────────────────────────
  const startWebCamera = async () => {
    try {
      setLoadingStep("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 640, height: 480 },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setVideoDimensions({
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight,
          });
          setHasPermission(true);
        };
      }
    } catch (err) {
      console.warn("Camera error:", err);
      setHasPermission(false);
    }
  };

  // ── WEB: Detection loop on video frames ───────────────────
  const runWebDetection = async (loadedModel) => {
    if (!videoRef.current || videoRef.current.readyState < 2) {
      rafRef.current = requestAnimationFrame(() => runWebDetection(loadedModel));
      return;
    }

    setIsDetecting(true);

    const loop = async () => {
      if (!videoRef.current) return;
      try {
        const preds = await loadedModel.detect(videoRef.current);
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
            // Box
            ctx.strokeStyle = "#ea580c";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, w, h);
            // Label background
            ctx.fillStyle = "#ea580c";
            ctx.fillRect(x - 1, y - 24, w + 2, 24);
            // Label text
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 12px monospace";
            ctx.fillText(
              `${p.class.toUpperCase()} ${Math.round(p.score * 100)}%`,
              x + 6,
              y - 7
            );
          });
        }
      } catch (e) {
        console.warn("Detection error:", e);
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    loop();
  };

  useEffect(() => {
    if (Platform.OS === "web") {
      initTF().then(async () => {
        await startWebCamera();
      });
    } else {
      // Native init
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
        setLoadingStep("Initializing TensorFlow...");
        await tf.ready();
        setIsTfReady(true);
        setLoadingStep("Loading vehicle detection model...");
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
      })();
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Start web detection once both model and video are ready
  useEffect(() => {
    if (Platform.OS === "web" && model && hasPermission) {
      runWebDetection(model);
    }
  }, [model, hasPermission]);

  // ── NATIVE: Camera stream handler ─────────────────────────
  const handleCameraStream = (images) => {
    const loop = async () => {
      if (model) {
        const nextImageTensor = images.next().value;
        if (nextImageTensor) {
          try {
            const preds = await model.detect(nextImageTensor);
            setPredictions(preds.filter(p => VEHICLE_CLASSES.includes(p.class)));
          } catch (e) {
            console.warn("Detection error:", e);
          } finally {
            tf.dispose(nextImageTensor);
          }
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();
  };

  // ── LOADING SCREEN (shared) ───────────────────────────────
  const isLoading = Platform.OS === "web"
    ? (!isTfReady || !model || hasPermission === null)
    : (hasPermission === null || !isTfReady || !model);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ea580c" />
        <Text style={styles.loadingText}>{loadingStep}</Text>
        <Text style={styles.loadingSubText}>AutoVision AI warming up...</Text>
      </View>
    );
  }

  // ── PERMISSION DENIED (shared) ────────────────────────────
  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text style={styles.webFallbackIcon}>🚫</Text>
        <Text style={styles.webFallbackTitle}>Camera Access Denied</Text>
        <Text style={styles.webFallbackSub}>
          Please allow camera access in your browser or device settings,
          then reload the page.
        </Text>
      </View>
    );
  }

  // ── WEB CAMERA VIEW ───────────────────────────────────────
  if (Platform.OS === "web") {
    const vehicleCount = predictions.length;
    return (
      <View style={styles.container}>
        {/* HUD */}
        <View style={styles.hud}>
          <View style={styles.hudLeft}>
            <View style={[styles.hudDot, isDetecting && styles.hudDotLive]} />
            <Text style={styles.hudTitle}>AUTOVISION LIVE</Text>
          </View>
          <Text style={styles.hudCount}>
            {vehicleCount} vehicle{vehicleCount !== 1 ? "s" : ""} detected
          </Text>
        </View>

        {/* Video + canvas overlay */}
        <View style={styles.webCameraContainer}>
          {/* eslint-disable-next-line */}
          <video
            ref={videoRef}
            style={webVideoStyle}
            autoPlay
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            style={webCanvasStyle}
          />
        </View>

        {/* No detection banner */}
        {vehicleCount === 0 && isDetecting && (
          <View style={styles.noDetection}>
            <Text style={styles.noDetectionText}>🔍 Scanning for vehicles...</Text>
          </View>
        )}

        {/* Supported classes */}
        <View style={styles.classRow}>
          {VEHICLE_CLASSES.map((c) => (
            <View key={c} style={styles.classTag}>
              <Text style={styles.classTagText}>{c}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  // ── NATIVE CAMERA VIEW ────────────────────────────────────
  const vehicleCount = predictions.length;
  return (
    <View style={styles.container}>
      <TensorCamera
        style={styles.camera}
        type={Camera.Constants?.Type?.back ?? "back"}
        cameraTextureHeight={1920}
        cameraTextureWidth={1080}
        resizeHeight={200}
        resizeWidth={152}
        resizeDepth={3}
        onReady={handleCameraStream}
        autorender={true}
      />

      {/* HUD */}
      <View style={styles.hud}>
        <View style={styles.hudLeft}>
          <View style={[styles.hudDot, styles.hudDotLive]} />
          <Text style={styles.hudTitle}>AUTOVISION LIVE</Text>
        </View>
        <Text style={styles.hudCount}>
          {vehicleCount} vehicle{vehicleCount !== 1 ? "s" : ""} detected
        </Text>
      </View>

      {/* Bounding boxes */}
      {predictions.map((p, i) => (
        <View key={i} style={[styles.box, {
          left: p.bbox[0], top: p.bbox[1],
          width: p.bbox[2], height: p.bbox[3],
        }]}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>
              {p.class} {Math.round(p.score * 100)}%
            </Text>
          </View>
        </View>
      ))}

      {vehicleCount === 0 && (
        <View style={styles.noDetection}>
          <Text style={styles.noDetectionText}>🔍 Scanning for vehicles...</Text>
        </View>
      )}

      <View style={styles.classRow}>
        {VEHICLE_CLASSES.map((c) => (
          <View key={c} style={styles.classTag}>
            <Text style={styles.classTagText}>{c}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// Web-only inline styles for video/canvas (can't use RN StyleSheet for HTML elements)
const webVideoStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const webCanvasStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
};

export default LiveCamera;