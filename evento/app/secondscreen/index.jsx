import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router"; // Ensure expo-router is installed

export default function SecondScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to the Second Screen!</Text>
      
      <Link href="/admin" style={styles.button}>
        <Text style={styles.buttonText}>ADMIN</Text>
      </Link>
      
      <Link href="/vendor" style={styles.button}>
        <Text style={styles.buttonText}>VENDOR</Text>
      </Link>
      
      <Link href="/exploreservices" style={styles.button}>
        <Text style={styles.buttonText}>EXPLORE SERVICES</Text>
      </Link>
      
      <Link href="/bookservices" style={styles.button}>
        <Text style={styles.buttonText}>BOOK SERVICES</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
    textAlign: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
