import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import { ActivityIndicator, Dimensions, TouchableOpacity } from "react-native";
import * as FileSystem from "expo-file-system";
import { Camera } from "expo-camera";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";
import * as FaceDetector from "expo-face-detector";

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

const IconBar = styled.View`
  margin-top: 50px;
`;

export default function App() {
  const [hasPermission, setHasPermisstion] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [smile, setSmile] = useState(false);

  const cameraRef = useRef();

  const requestCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermisstion(status === "granted");
  };

  const switchCameraType = () => {
    if (type === Camera.Constants.Type.front) {
      setType(Camera.Constants.Type.back);
    } else {
      setType(Camera.Constants.Type.front);
    }
  };

  const onFacesDetected = ({ faces }) => {
    const face = faces[0];
    if (face) {
      if (face.smilingProbability > 0.7) {
        setSmile(true);
        takePhoto();
      }
    }
  };

  const takePhoto = async () => {
    try {
      if (cameraRef.current) {
        let { uri } = await cameraRef.current.takePictureAsync({
          quality: 1,
        });
        if (uri) {
          savePhoto(uri);
        }
      }
    } catch (e) {
      alert(error);
      setSmile(false);
    }
  };

  const savePhoto = async (uri) => {};

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
          type={type}
          onFacesDetected={smile ? null : onFacesDetected}
          faceDetectorSettings={{
            detectLandmarks: FaceDetector.Constants.Landmarks.all,
            runClassifications: FaceDetector.Constants.Classifications.all,
          }}
          ref={cameraRef}
        />
        <IconBar>
          <TouchableOpacity>
            <MaterialIcons
              name={
                type === Camera.Constants.Type.front
                  ? "camera-rear"
                  : "camera-front"
              }
              color="white"
              size={50}
              onPress={switchCameraType}
            />
          </TouchableOpacity>
        </IconBar>
      </CenterView>
    );
  }
}
