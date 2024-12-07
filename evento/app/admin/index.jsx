import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, Button, TextInput, Alert } from "react-native";

export default function Admin() {
  const [vendors, setVendors] = useState([]);
  const [newVendor, setNewVendor] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    // Fetch vendors from the backend API
    fetch("http://localhost:5000/vendors") // Replace with your server's URL
      .then((response) => response.json())
      .then((data) => setVendors(data))
      .catch((error) => console.error("Error fetching vendors:", error));
  }, []);

  // Function to handle vendor addition
  const addVendor = () => {
    if (!newVendor.name || !newVendor.username || !newVendor.email || !newVendor.password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    fetch("http://localhost:5000/vendors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newVendor),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        setVendors((prevVendors) => [
          ...prevVendors,
          { id: Date.now(), ...newVendor }, // Simulate the added vendor
        ]);
        setNewVendor({ name: "", username: "", email: "", password: "" }); // Reset the form
        Alert.alert("Success", "Vendor added successfully");
      })
      .catch((error) => console.error("Error adding vendor:", error));
  };

  // Function to handle vendor deletion
  const deleteVendor = (id) => {
    fetch(`http://localhost:5000/vendors/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        setVendors((prevVendors) => prevVendors.filter((vendor) => vendor.id !== id));
        Alert.alert("Success", "Vendor deleted successfully");
      })
      .catch((error) => console.error("Error deleting vendor:", error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to the Admin Page</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={newVendor.name}
        onChangeText={(text) => setNewVendor({ ...newVendor, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={newVendor.username}
        onChangeText={(text) => setNewVendor({ ...newVendor, username: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={newVendor.email}
        onChangeText={(text) => setNewVendor({ ...newVendor, email: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={newVendor.password}
        onChangeText={(text) => setNewVendor({ ...newVendor, password: text })}
      />

      <Button title="Add Vendor" onPress={addVendor} />

      <ScrollView style={styles.vendorList}>
        {vendors.map((vendor) => (
          <View key={vendor.id} style={styles.vendorCard}>
            <Text style={styles.vendorText}>Name: {vendor.name}</Text>
            <Text style={styles.vendorText}>Username: {vendor.username}</Text>
            <Text style={styles.vendorText}>Email: {vendor.email}</Text>
            <Text style={styles.vendorText}>Password: {vendor.password}</Text>
            <Button
              title="Delete"
              onPress={() => deleteVendor(vendor.id)}
              color="red"
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 5,
  },
  vendorList: {
    marginTop: 20,
  },
  vendorCard: {
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  vendorText: {
    fontSize: 16,
    color: "#555",
  },
});
