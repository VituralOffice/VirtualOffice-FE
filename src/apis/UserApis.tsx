import ApiService from "./ApiService"

export const GetUserProfile = async () => {
    const response = await ApiService.getInstance().get('/users/profile')
    return response;
}