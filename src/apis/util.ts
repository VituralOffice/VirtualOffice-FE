export function isApiSuccess(response: any): boolean {
    return response && response.code && response.code >= 200 && response.code < 300;
}

export const callApi = async (apiFunction: () => Promise<any>) => {
    try {
        // Gọi hàm API cụ thể
        const response = await apiFunction();
        return response;
    } catch (error) {
        // Xử lý lỗi
        console.error('API call failed:', error);
        throw error; // Ném lỗi để cho caller biết rằng có lỗi xảy ra
    }
};

// Hàm lấy giá trị của cookie
export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(';').shift();
};

// Hàm thiết lập giá trị của cookie
export const setCookie = (name, value, days) => {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value || ''}${expires}; path=/`;
};

// Hàm lưu trữ giá trị vào localStorage
export const setLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

// Hàm lấy giá trị từ localStorage
export const getLocalStorage = (key) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
};

export const removeLocalStorage = (key) => {
    const value = localStorage.removeItem(key);
};