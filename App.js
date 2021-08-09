import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { ActivityIndicator, Dimensions, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import styled from "styled-components/native";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

const CenterView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: cornflowerblue;
`;

const Text = styled.Text`
  color: white;
  font-size: 22px;
`;

export default function App() {
  const [hasPermission, setHasPermisstion] = useState(null);

  const requestCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermisstion(status === "granted");
  };

  useEffect(() => {
    requestCamera();
  }, []);

  if (hasPermission === null) {
    return (
      <CenterView>
        <ActivityIndicator size="large" color="#000000" />
      </CenterView>
    );
  } else if (hasPermission === false) {
    return (
      <CenterView>
        <Text>No access to camera</Text>
      </CenterView>
    );
  } else {
    return (
      <CenterView>
        <Camera
          style={{
            width: WIDTH - 20,
            height: HEIGHT / 1.5,
            borderRadius: 10,
            overflow: "hidden",
          }}
          type={Camera.Constants.Type.front}
        />
      </CenterView>
    );
  }
}
