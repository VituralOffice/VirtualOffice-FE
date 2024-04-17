export function isApiSuccess(responseCode: number): boolean {
    return responseCode >= 200 && responseCode < 300;
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