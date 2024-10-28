import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native'
import React, { useState } from 'react'
import CustomSafeAreaView from '@/components/ui/CustomSafeAreaView';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { signupStyles } from '@/styles/signupStyles';
import { launchGallery } from '@/utils/LibraryHelpers';
import CustomText from '@/components/ui/CustomText';
import { Platform } from 'react-native';
import { uploadFile } from '@/service/api/fileService';
import { checkUsername, signUpWithGoogle } from '@/service/api/authService';
import CustomInput from '@/components/ui/CustomInput';


const Page = () => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState<any>('');
  const [loading, setLoading] = useState(false);

  const createAccount = async () => {
    if(!firstName || !lastName || !username || !profilePicture){
      Alert.alert('Please fill in all fields');
      return;
    }    
    setLoading(true);

    try {
      const mediaUrl = await uploadFile(profilePicture);
      await signUpWithGoogle({
        first_name: firstName,
        last_name: lastName,
        username: username,
        profile_picture: mediaUrl
      });
      
    } catch (error) {
      
    }finally{
      setLoading(false);
    }
  }

  const handleImagePick = async () =>{
    const res = await launchGallery();

    if(res){
      setProfilePicture(res);
    }
  }
  const validateUsername = async (name: string) => {
    if(name.length > 3){
      const isValid = await checkUsername(name);
      return isValid;
    }
    return false;
  }

  return (
    <CustomSafeAreaView style={signupStyles.container}>
      {/* Remove the wrapping View that's constraining the footer */}
      <TouchableOpacity onPress ={() => router.back()} style={{position:'absolute', top:80, left:20}}>
        <Ionicons name='arrow-back-outline' size={RFValue(20)} color='#fff'/>
      </TouchableOpacity>
      
      <TouchableOpacity style={[signupStyles.cameraIcon, {
        marginTop: Platform.OS === 'ios' ? RFValue(20) : RFValue(60)
      }]} onPress={handleImagePick}>
          {profilePicture?.uri ? (
            <Image source={{uri: profilePicture?.uri}} style={signupStyles.image}/>
          ) : (
            <MaterialCommunityIcons name="camera-plus" size={RFValue(18)} color='#fff'/>
          )}
      </TouchableOpacity>
      
      <CustomText variant='h4' style={signupStyles.profileText}>
        Profile Info
      </CustomText>
      <CustomText style={signupStyles.instructions}>
        Add your profile picture, unique username and name to get started
      </CustomText>

      <CustomInput label='First Name' value={firstName} onChangeText={setFirstName}/>
      <CustomInput label='Last Name' value={lastName} onChangeText={setLastName}/>
      <CustomInput label='Username' value={username} onChangeText={setUsername} 
        showValidationIcon={true} validationFunction={validateUsername}/>


      <View style={signupStyles.footer}>  
        <CustomText style={signupStyles.termsText}>
          By signing up, you agree to our Terms of Service and Privacy Policy
        </CustomText>

        <TouchableOpacity style={signupStyles.submitButton} onPress={createAccount}>
          {
            !loading ? 
              <MaterialCommunityIcons name='arrow-right' size={RFValue(24)} color='#fff'/>
              :
              <ActivityIndicator color= '#fff' size='small'/>
          }
        </TouchableOpacity>
        
      </View>
    </CustomSafeAreaView>
  )
}

export default Page
