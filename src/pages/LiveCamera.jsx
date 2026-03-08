import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Camera } from "expo-camera";
import * as tf from "@tensorflow/tfjs";
import { cameraWithTensors } from "@tensorflow/tfjs-react-native";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { styles } from "../styles/LiveCamera";

const TensorCamera = cameraWithTensors(Camera);

function LiveCamera() {
  const [hasPermission, setHasPermission] = useState(null);
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isTfReady, setIsTfReady] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");

      await tf.ready();
      setIsTfReady(true);
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
    })();
  }, []);

  const handleCameraStream = (images) => {
    const loop = async () => {
      if (model) {
        const nextImageTensor = images.next().value;
        if (nextImageTensor) {
          const preds = await model.detect(nextImageTensor);
          setPredictions(preds);
          tf.dispose(nextImageTensor);
        }
      }
      requestAnimationFrame(loop);
    };
    loop();
  };

  if (hasPermission === null || !isTfReady || !model) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading AI Vision System...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TensorCamera
        style={styles.camera}
        type={Camera.Constants?.Type?.back || 'back'}
        cameraTextureHeight={1920}
        cameraTextureWidth={1080}
        resizeHeight={200}
        resizeWidth={152}
        resizeDepth={3}
        onReady={handleCameraStream}
        autorender={true}
      />
      
      {predictions.map((p, i) => {
        if (!["car", "truck", "bus", "motorcycle"].includes(p.class)) return null;
        
        return (
          <View
            key={i}
            style={[
              styles.box,
              {
                left: p.bbox[0],
                top: p.bbox[1],
                width: p.bbox[2],
                height: p.bbox[3],
              },
            ]}
          >
            <View style={styles.labelContainer}>
              <Text style={styles.label}>{p.class} {Math.round(p.score * 100)}%</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default LiveCamera;