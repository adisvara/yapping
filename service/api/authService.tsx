import { resetAndNavigate } from '@/utils/LibraryHelpers';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios';
import { BASE_URL } from '../config';
import { tokenStorage } from '../storage';
import { useAuthStore } from '../authStore';

GoogleSignin.configure({
    webClientId: '266771316323-cs3ubptioeoqlua3vnoc69s5r417fm6q.apps.googleusercontent.com',
    forceCodeForRefreshToken: true,
    offlineAccess: true
});

export const signInWithGoogle = async () => {
    try {
        await GoogleSignin.hasPlayServices();
        await GoogleSignin.signOut();
        const res = await GoogleSignin.signIn();
       
        const apiRes = await axios.post(`${BASE_URL}/oauth/login`,{
            id_token: res.data?.idToken
        });

        const {tokens, user} = apiRes.data;

        tokenStorage.set('accessToken',tokens?.access_token);
        tokenStorage.set('refreshToken',tokens?.refresh_token);

        const {setUser} = useAuthStore.getState();
        setUser(user);
        resetAndNavigate('/(home)/home');

    } catch (error: any) {
        console.error("Google Sign-In Error:", error);
    }
}

export const signUpWithGoogle = async (data: any) => {
    try {
        await GoogleSignin.hasPlayServices();
        await GoogleSignin.signOut();
        const res = await GoogleSignin.signIn();
       
        const apiRes = await axios.post(`${BASE_URL}/oauth/login`,{
            id_token: res.data?.idToken,
            ...data
        });

        const {tokens, user} = apiRes.data;

        tokenStorage.set('accessToken',tokens?.access_token);
        tokenStorage.set('refreshToken',tokens?.refresh_token);

        const {setUser} = useAuthStore.getState();
        setUser(user);
        resetAndNavigate('/(home)/home');

    } catch (error: any) {
        console.log("Error during sign up with google", error);
    }
}

export const checkUsername = async (username: string) => {
    try {
        const apiRes = await axios.post(`${BASE_URL}/oauth/check-username`, {username});
        return apiRes.data?.available;
    } catch (error) {
        console.log("Error checking username", error);
        return false;
    }
}
