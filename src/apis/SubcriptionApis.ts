import ApiService from './ApiService'

export const GetHighestMonthlyPriceSubcription = async () => {
  // Gọi API đăng nhập
  const response = await ApiService.getInstance().get(`/subscriptions/highest-monthly-price`)
  return response
}

export const GetAllSubscriptions = async () => {
  const response = await ApiService.getInstance().get(`/subscriptions`)
  return response
}
