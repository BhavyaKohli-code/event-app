import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, FlatList, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';

export default function VendorDashboard() {
  const { name, email, vendorId } = useLocalSearchParams();  // Get vendor details from URL params
  const [pictures, setPictures] = useState([]);

  // Fetch pictures when the component mounts
  useEffect(() => {
    if (vendorId) {
      fetchPictures();
    } else {
      Alert.alert('Error', 'Vendor ID is missing.');
    }
  }, [vendorId]);

  const fetchPictures = async () => {
    try {
      const response = await fetch(`http://localhost:5000/vendor/pictures/${vendorId}`);
      const data = await response.json();
      setPictures(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch pictures');
    }
  };

  const uploadPicture = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'You need to grant camera roll permissions to upload pictures.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const image = result.assets[0];  // Get the first image from the assets array
        const filename = image.uri.split('/').pop();
        const mimeType = image.type || 'image/jpeg';  // Ensure MIME type is correct

        // Prepare FormData
        const formData = new FormData();
        formData.append('picture', {
          uri: image.uri,
          file: filename,
          type: mimeType,  // Correct MIME type
        });
        formData.append('vendorId', vendorId);  // Add vendorId to the FormData

        // Send the FormData to the backend
        const response = await fetch('http://localhost:5000/vendor/upload', {
          method: 'POST',
          body: formData,
        });
        console.log (response)
        return

        const data = await response.json();  // Parse the response as JSON
        if (response.ok) {
          Alert.alert('Success', data.message);
          fetchPictures();  // Refresh the picture list
        } else {
          Alert.alert('Error', data.error || 'Failed to upload picture');
        }
      } else {
        Alert.alert('Error', 'No image selected.');
      }
    } catch (error) {
      console.error('Error uploading picture:', error);
      Alert.alert('Error', 'Something went wrong during upload. Please try again.');
    }
  };

  const deletePicture = async (pictureId) => {
    try {
      const response = await fetch(`http://localhost:5000/vendor/pictures/${pictureId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      Alert.alert('Success', data.message);
      fetchPictures();  // Refresh the picture list
    } catch (error) {
      Alert.alert('Error', 'Failed to delete picture');
    }
  };

  const renderPicture = ({ item }) => (
    <View style={styles.pictureContainer}>
      <Image
        source={{ uri: `http://localhost:5000/uploads/${item.path}` }}
        style={styles.picture}
      />
      <Button title="Delete" color="red" onPress={() => deletePicture(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {name}</Text>
      <Text>Email: {email}</Text>
      <Text>Vendor ID: {vendorId}</Text>  {/* Display the Vendor ID */}
      <Button title="Upload Picture" onPress={uploadPicture} />
      <FlatList
        data={pictures}
        renderItem={renderPicture}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        style={styles.pictureGrid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pictureGrid: {
    marginTop: 20,
  },
  pictureContainer: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
  },
  picture: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
});
