import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL, // or use reactAppBaseUrl
});

// Flag to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (token) {
            prom.resolve(token);
        } else {
            prom.reject(error);
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get("Token");
        if (token) config.headers["Authorization"] = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers["Authorization"] = "Bearer " + token;
                            resolve(axiosInstance(originalRequest));
                        },
                        reject: (err: any) => reject(err),
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = Cookies.get("RefreshToken");

            try {
                const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/RefreshToken`, {
                    AccessToken: Cookies.get("Token"),
                    RefreshToken: refreshToken,
                });

                const newToken = response.data?.Token;
                const newRefreshToken = response.data?.RefreshToken;

                Cookies.set("Token", newToken, { path: "/" });
                Cookies.set("RefreshToken", newRefreshToken, { path: "/" });
                axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + newToken;
                originalRequest.headers["Authorization"] = "Bearer " + newToken;

                processQueue(null, newToken);
                return axiosInstance(originalRequest);
            } catch (err) {
                processQueue(err, null);
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
