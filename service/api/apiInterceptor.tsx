import axios from 'axios';
import { BASE_URL } from '../config'; // Assuming API_BASE_URL is defined in a config file
import { tokenStorage } from '../storage';
import { resetAndNavigate } from '@/utils/LibraryHelpers';

export const appAxios = axios.create({
    baseURL: BASE_URL,
});

export const refresh_Tokens = async () => {
    try {
        const refreshToken = tokenStorage.getString('refreshToken');
        const response = await appAxios.post(`${BASE_URL}/auth/refresh-token`,{
            refreshToken: refreshToken})
        const new_access_token = response.data.access_token;
        const new_refresh_token = response.data.refresh_token;
        tokenStorage.set('accessToken',new_access_token);
        tokenStorage.set('refreshToken',new_refresh_token);
        return new_access_token;
    } catch (error) {
        console.log("Refresh token failed");
        tokenStorage.clearAll();
        resetAndNavigate('/(auth)/signin')
    }
}
appAxios.interceptors.request.use(async (config) => {
    const accessToken = tokenStorage.getString('accessToken');
    if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
})
appAxios.interceptors.response.use(
    response => response, 
    async error => {
        if(error.response && error.response.status === 401){
            try {
                const newAccessToken = await refresh_Tokens();
                if(newAccessToken){
                    error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                    return appAxios(error.config);
                }
            } catch (error) {
                console.log("Refresh token failed");
            }
            if(error.response && error.response.status != 401){
                const error_message = error.response.data.message || error.message;
            }
        }
        return Promise.reject(error);
    }
)  
