import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import CustomSafeAreaView from '@/components/ui/CustomSafeAreaView'
import LottieView from 'lottie-react-native'
import { siginStyles } from '@/styles/signinStyles'
import CustomText from '@/components/ui/CustomText'

const Page = () => {

  const handleLogin = async () => {
    
  }

  return (
    <CustomSafeAreaView style={siginStyles.container}>
      <LottieView 
        autoPlay
        loop
        style={siginStyles.animation}
        source={require('@/assets/animations/telegram.json')}
      />
      <CustomText variant='h3' style={siginStyles.title}>Welcome to Yapping</CustomText>
      <CustomText style={siginStyles.message}>All your rants are end-to-end encrypted</CustomText>
      
      <TouchableOpacity style={siginStyles.loginBtn} onPress={handleLogin}>
        <CustomText style={siginStyles.loginBtnText}>Login with Google</CustomText>
        <Image source={require('@/assets/icons/google.png')} style={siginStyles.googleIcon}/>
      </TouchableOpacity>
    </CustomSafeAreaView>
  )
}

export default Page