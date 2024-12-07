import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen name="secondscreen" />
      <Stack.Screen name="admin" />
      <Stack.Screen name="index" />
      <Stack.Screen name="vendor" />
      <Stack.Screen name="exploreservices" />
      <Stack.Screen name="bookservices" />
      <Stack.Screen name="vendor/vendordashboard" 
       initialParams={{ name: '', email: '', vendorId: '' }}
      
      />
    </Stack>
  );
}
