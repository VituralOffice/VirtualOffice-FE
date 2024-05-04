export function isApiSuccess(response: any): boolean {
    return response && response.message == "Success";
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