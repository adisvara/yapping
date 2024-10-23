import { resetAndNavigate } from '@/utils/LibraryHelpers';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios';
import { BASE_URL } from '../config';
import { tokenStorage } from '../storage';
import { useAuthStore } from '../authStore';

GoogleSignin.configure({
    webClientId: '266771316323-cs3ubptioeoqlua3vnoc69s5r417fm6q.apps.googleusercontent.com',
    forceCodeForRefreshToken: true,
    offlineAccess: false
});

export const signInWithGoogle = async () => {
    try {
        await GoogleSignin.hasPlayServices();
        await GoogleSignin.signOut();
        const res = await GoogleSignin.signIn();
        
        const apiRes = await axios.post(`${BASE_URL}/auth/google-login`,{
            id_token: res.data?.idToken
        });

        const {tokens,user} = apiRes.data;

        tokenStorage.set('accessToken',tokens?.access_token);
        tokenStorage.set('refreshToken',tokens?.refresh_token);

        const {setUser} = useAuthStore.getState();
        setUser(user);
        resetAndNavigate('/(home)home');

    } catch (error:any) {
        console.log(error.message.status);
        if(error.message.status == 400){
            resetAndNavigate('/(auth)/signup')
        }
    }
}