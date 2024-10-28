import { Platform } from "react-native";

export const BASE_URL = __DEV__
  ? Platform.OS === 'android'
    ? 'http://10.0.2.2:3000'  // For Android Emulator
    : 'http://localhost:3000' // For iOS Simulator
  : 'https://your-production-api.com'; // Your production API URL

export const SOCKET_URL = Platform.OS === 'android' ? 'ws://10.0.2.2:3000' : 'ws://localhost:3000'