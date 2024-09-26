import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Text } from 'react-native';
import Webcam from 'react-webcam';
import { Button } from '@rneui/themed';
import { submitImage } from 'src/services/media/submitImage';

const Camera: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [showCapture, setShowCapture] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);

  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setPhotoUri(imageSrc);
        fetch(imageSrc)
          .then(res => res.blob())
          .then(blob => {
            const timestamp = Date.now();
            const file = new File([blob], `photo_${timestamp}.jpg`, { type: 'image/jpeg' });
            setPhotoFile(file); 
          });
        setShowCapture(false);
        setShowCamera(false);
      }
    }
  };

  const toggleCamera = () => {
    setShowCamera(true);
  };

  useEffect(() => {
    
  }, []);

  const handelSubmitImage = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('image', photoFile);
    try {
      const response = await submitImage(formData);
      setLoading(false);
      setResultImage(response.data.name);
      console.log(response.data.confidence);
      setConfidence(response.data.confidence);
    } catch (error) {
      console.error('Failed to submit image:', error);
    }
  };

  return (
    <View style={styles.container}>
  {loading ? (
    <View>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  ) : (
    <>
      {showCamera ? (
        <>
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={styles.webcam}
            videoConstraints={{
              facingMode: "user"
            }}
          />
          <TouchableOpacity onPress={capturePhoto} style={styles.captureButton}>
            <Image
              source={{ uri: 'https://img.icons8.com/nolan/64/camera.png' }}
              style={styles.icon}
            />
          </TouchableOpacity>
        </>
      ) : showCapture ? (
        <Button onPress={toggleCamera} containerStyle={{ borderRadius: 10 }}>
          Capture
        </Button>
      ) : (
        <Button onPress={handelSubmitImage} containerStyle={{ borderRadius: 10 }}>
          Submit
        </Button>
      )}
      {photoUri && (
        <Image source={{ uri: photoUri }} style={styles.imagePreview} />
      )}
      {resultImage && (
        <Text style={styles.resultText}>{resultImage} {(confidence ? `: ${confidence}%` : '')}</Text>
      )}
    </>
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
  resultText: {
    fontSize: 25,
    color: '#000',
  }
});

export default Camera;
