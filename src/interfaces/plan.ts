export interface IPlan {
  id: string
  _id: string
  name: string
  maxRoom: number
  maxRoomCapacity: number
  monthlyPrice: number
  annuallyPrice: number
  features: string[]
  free: boolean
}
export enum BILLING_CYCLE {
  MONTH = 'month',
  YEAR = 'year',
}
export interface ISubscription {
  _id: string
  plan: IPlan
  freePlan: boolean
  total: number
  status: string
  paymentStatus: string
  startDate: string
  endDate: string
}
