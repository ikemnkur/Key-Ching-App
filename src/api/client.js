
import axios from 'axios';


const api = axios.create({ baseURL: import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3001' });


// Attach auth token to all requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    console.log('🔐 API Interceptor - Token exists:', !!token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("token:", token);   
        // console.log('✅ Authorization header added');
    } else {
        console.warn('⚠️ No token found in localStorage');
    }
    return config;
}, (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
});


export default api;



// import axios from 'axios';


// const api = axios.create({ baseURL: import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3001' });


// // Attach auth token if you add auth later
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
// });


// export default api;