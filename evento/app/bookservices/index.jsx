import React from "react";
import { Text, View, StyleSheet } from "react-native";

export default function BookServices() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to the Book Services Page</Text>
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
    color: "#333",
  },
});
