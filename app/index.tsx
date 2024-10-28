import { View, Text, Image, LogBox, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { splashStyles } from '@/styles/splashStyles'
import { resetAndNavigate } from '@/utils/LibraryHelpers'
import { tokenStorage } from '@/service/storage';
import { jwtDecode } from 'jwt-decode';
import { refresh_Tokens } from '@/service/api/apiInterceptor';

interface DecodedToken{
  exp: number;
}

LogBox.ignoreAllLogs();

const Main = () => {
  
  const tokenCheck = async () => {
    const accessToken = tokenStorage.getString('accessToken') as string;
    const refreshToken = tokenStorage.getString('refreshToken') as string;

    if(accessToken){
      const decodedAccessToken = jwtDecode<DecodedToken>(accessToken);
      const decodedRefreshToken = jwtDecode<DecodedToken>(refreshToken);

      const currentTime = Date.now()/1000;

      if(decodedRefreshToken?.exp < currentTime){
        await resetAndNavigate('/(auth)/signin')
        Alert.alert('Session Expired', 'Please login again');
        return false;
      }

      if(decodedAccessToken?.exp < currentTime){
        try{
          await refresh_Tokens();
        } catch(error){
          console.log(error);
          Alert.alert('There was an error');
          return false;
        }
      }
      resetAndNavigate('/(home)/home')
      return true
    }
    resetAndNavigate('/(auth)/signin')
    return false;

  }

  useEffect(() => {
    const timeoutID = setTimeout(tokenCheck,1000);
    return () => clearTimeout(timeoutID);
  },[])

  return (
    <View style={splashStyles.container}>
      <Image 
        source={require('@/assets/images/adaptive-icon.png')} 
        style={splashStyles.logo} 
      />
    </View>
  )
}

export default Main
