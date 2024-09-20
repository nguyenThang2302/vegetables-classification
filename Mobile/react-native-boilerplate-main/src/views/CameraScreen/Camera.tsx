import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Webcam from 'react-webcam';
import { Button } from '@rneui/themed';

const Camera: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [showCapture, setShowCapture] = useState<boolean>(true);

  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setShowCapture(false);
      setPhotoUri(imageSrc);
      setShowCamera(false);
    }
  };

  const toggleCamera = () => {
    setShowCamera(true);
  };

  const handelSubmitImage = () => {
    console.log(photoUri);
  };

  return (
    <View style={styles.container}>
      {showCamera ? (
        <>
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={styles.webcam}
          />
          <TouchableOpacity onPress={capturePhoto} style={styles.captureButton}>
            <Image
              source={{ uri: 'https://img.icons8.com/nolan/64/camera.png' }}
              style={styles.icon}
            />
          </TouchableOpacity>
        </>
      ) : (
        showCapture ? (
          <Button onPress={toggleCamera} containerStyle={{ borderRadius: 10 }}>Capture</Button>
        ) : (
          <Button onPress={handelSubmitImage} containerStyle={{ borderRadius: 10 }}>Submit</Button>
        )
      )}
      {photoUri && (
        <Image source={{ uri: photoUri }} style={styles.imagePreview} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webcam: {
    width: '100%',
    height: '60%',
  },
  button: {
    padding: 10,
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 40,
    backgroundColor: 'white',
    marginBottom: 10,
    width: 150,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    padding: 10,
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 40,
    backgroundColor: 'white',
    marginBottom: 10,
    width: 150,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
  },
  imagePreview: {
    width: 300,
    height: '40%',
    resizeMode: 'contain',
  },
});

export default Camera;
