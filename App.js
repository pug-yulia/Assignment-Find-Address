import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const API_URL = process.env.EXPO_PUBLIC_GEOCODE_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_GEOCODE_API_KEY;

export default function App() {
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState({
    latitude: 60.200692, //default helsinki
    longitude: 24.934302,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [markerCoords, setMarkerCoords] = useState(null);

  const handleShowAddress = async () => {
    if (!address.trim()) {
      Alert.alert('Error', 'Please type an address');
      return;
    }

    try {
      //append api
      const url = `${API_URL}?q=${encodeURIComponent(address)}&api_key=${API_KEY}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        Alert.alert('Address not found', 'Try a different address');
        return;
      }

      const { lat, lon } = data[0];
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);

      setRegion({
        ...region,
        latitude,
        longitude,
      });

      setMarkerCoords({ latitude, longitude });
    } catch (error) {
      console.log('Error fetching coordinates:', error);
      Alert.alert('Error', 'Could not fetch coordinates. Check console.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type an address"
        value={address}
        onChangeText={setAddress}
      />
      <Button title="Show" onPress={handleShowAddress} />

      <MapView style={styles.map} region={region}>
        {markerCoords && <Marker coordinate={markerCoords} title={address} />}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  map: {
    flex: 1,
  },
});
