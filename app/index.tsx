import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import { splashStyles } from '@/styles/splashStyles'
import { resetAndNavigate } from '@/utils/LibraryHelpers'

const Main = () => {
  useEffect(() => {
    setTimeout(() => {
        resetAndNavigate('/(auth)/signin')
    }, 300)
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
