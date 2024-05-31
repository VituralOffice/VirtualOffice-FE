import styled from 'styled-components'
import { AntSwitch, IOSSwitch } from '../switches/CustomSwitches'
import { ButtonProps } from '../../interfaces/Interfaces'
import { useEffect, useState } from 'react'
import ApiService from '../../apis/ApiService'
import { BILLING_CYCLE, IPlan, ISubscription } from '../../interfaces/plan'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'

const ContentHeader = styled.div`
  padding-top: 56px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
  .space-name {
    font-size: 26px;
    font-weight: 700;
    line-height: 34px;
    color: rgb(255, 255, 255);
    padding-right: 24px;
    padding-bottom: 16px;
  }
`

const LinkButton = styled.div`
  display: flex;
  position: relative;
  box-sizing: border-box;
  outline: none;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  font-family: inherit;
  font-weight: 700;
  transition: background-color 200ms ease 0s, border-color 200ms ease 0s;
  cursor: pointer;
  opacity: 1;
  overflow: hidden;
  background-color: rgb(84, 92, 143);
  border: 2px solid transparent;
  padding: 0px 16px;
  width: auto;
  min-width: min(104px, 100%);
  max-width: 100%;
  height: 40px;
  border-radius: 10px;
  font-size: 15px;
  color: rgb(255, 255, 255) !important;

  &:hover {
    background-color: rgb(118, 125, 165);
  }
`

const ContentBody = styled.div`
  display: flex;
  padding-bottom: 32px;
  & > div {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-top: 16px;
  }
`

const SubcriptionOrder = styled.div`
  display: flex;
  flex-direction: column;
  background-color: rgb(235, 240, 255);
  border-radius: 16px;
  width: 376px;
  flex-shrink: 0;
  margin-bottom: 16px;
  overflow: hidden;
  .subcription-header {
    display: flex;
    background-color: rgb(255, 230, 141);
    flex-direction: column;
    padding: 24px;
    .description {
      color: rgb(51, 58, 100);
      font-family: 'DM Sans', sans-serif;
      font-weight: 500;
      font-size: 13px;
      line-height: 17px;
    }
  }
  .subcription-body {
    display: flex;
    flex-direction: column;
    padding: 24px;
    gap: 16px;
  }
`

const AutoRenew = styled.div`
  border-radius: 8px;
  padding: 4px 8px;
  margin-left: 6px;
  text-align: center;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.03em;
  color: rgb(17, 17, 17);
  background-color: rgb(251, 193, 44);
`

const DetailsBlock = styled.div`
  & > p {
    margin: 0;
    padding: 3px 0px;
  }
`

const PriceBlock = styled.div`
  display: flex;
  margin-bottom: 4px;
  align-items: baseline;
  flex-direction: column;
  gap: 8px;
  .price-text {
    font-size: 34px;
    line-height: 34px;
    font-weight: 700;
    color: rgb(32, 37, 64);
  }
  .desc {
    color: rgb(51, 58, 100);
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 15px;
    line-height: 20px;
  }
`

const BillOptionsBlock = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  .title {
    display: flex;
    opacity: 1;

    & > span {
      color: rgb(51, 58, 100);
      font-weight: 500;
      font-size: 15px;
      line-height: 20px;
    }
  }
  .discount-text {
    display: flex;
    padding: 2px 4px;
    align-items: flex-start;
    gap: 8px;
    border-radius: 8px;
    background: rgba(144, 173, 255, 0.3);
    & > span {
      color: rgb(67, 88, 216);
      font-weight: 500;
      font-size: 15px;
      line-height: 20px;
    }
  }
  .desc {
    display: flex;
    opacity: 0.6;
    & > span {
      color: rgb(51, 58, 100);
      font-weight: 500;
      font-size: 15px;
      line-height: 20px;
    }
  }
`

const ButtonSelect = styled.button`
  display: flex;
  position: relative;
  box-sizing: border-box;
  outline: none;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  font-family: inherit;
  font-weight: 700;
  transition: background-color 200ms ease 0s, border-color 200ms ease 0s;
  cursor: pointer;
  opacity: 1;
  overflow: hidden;
  background-color: rgb(88, 130, 247);
  border: 2px solid transparent;
  padding: 0px 16px;
  width: 100%;
  min-width: min(104px, 100%);
  max-width: 100%;
  height: 40px;
  border-radius: 10px;
  font-size: 15px;
  color: rgb(255, 255, 255) !important;

  &:hover {
    background-color: rgb(121, 155, 249);
  }
`

export default function PlansAndBilling() {
  const [plans, setPlans] = useState<IPlan[]>([])
  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([])
  const fetchSubscription = async () => {
    try {
      const res = await ApiService.getInstance().get(`/subscriptions`)
      setSubscriptions(res.result)
    } catch (error) {}
  }
  const fetchListPlan = async () => {
    try {
      const res = await ApiService.getInstance().get(`/plans`)
      setPlans(res.result)
    } catch (error) {}
  }
  const fetchData = () => {
    fetchSubscription().then(() => fetchListPlan())
  }
  const handleRetryCheckout = async (subscription: ISubscription) => {
    try {
      if (!subscription) return
      const res = await ApiService.getInstance().post(`/payments/checkout_retry`, {
        subscriptionId: subscription._id,
      })
      if (res.message === `Success`) {
        const result = res.result
        window.open(result.checkoutUrl)
      }
      fetchSubscription()
    } catch (error) {
      console.log(error)
      if (error instanceof AxiosError) toast(error.response?.data.result.message)
    }
  }
  const handleCancel = async (subscription: ISubscription) => {
    try {
      if (!subscription) return
      await ApiService.getInstance().post(`/payments/cancel`, {
        subscriptionId: subscription._id,
      })
      fetchSubscription()
    } catch (error) {
      console.log(error)
      if (error instanceof AxiosError) toast(error.response?.data.result.message)
    }
  }
  const handleCheckout = async (plan: IPlan) => {
    try {
      if (!plan) return
      console.log({ plan })
      const res = await ApiService.getInstance().post(`/payments/checkout`, {
        planId: plan._id,
        billingCycle: isAnnually ? BILLING_CYCLE.YEAR : BILLING_CYCLE.MONTH,
      })
      if (res.message === `Success`) {
        const result = res.result
        window.open(result.checkoutUrl)
      }
    } catch (error) {
      console.log(error)
      if (error instanceof AxiosError) toast(error.response?.data.result.message)
    }
  }
  const [isAnnually, setIsAnnually] = useState(true)
  useEffect(() => {
    fetchData()
  }, [])
  return (
    <>
      <ContentHeader>
        <div className="space-name">Plans & Billing</div>
        {/* <div style={{ display: 'flex', marginBottom: '16px', gap: '8px' }}>
          <LinkButton>Enter Space</LinkButton>
        </div> */}
      </ContentHeader>

      <ContentBody>
        <div style={{ display: 'flex' }}>
          {subscriptions.map((subscription) => (
            <SubcriptionOrder>
              <div className="subcription-header">
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span
                      style={{
                        color: 'rgb(17, 17, 17)',
                        fontWeight: '700',
                        fontSize: '20px',
                        lineHeight: '26px',
                      }}
                    >
                      Premium
                    </span>
                    {/* <AutoRenew>AUTO RENEWS</AutoRenew> */}
                  </div>
                </div>
                <span className="description">Best for remote teams collaborating day-to-day</span>
              </div>
              <div className="subcription-body">
                <DetailsBlock>
                  <p>Status: {subscription.status}</p>
                  <p>Payment status: {subscription.paymentStatus}</p>
                  {subscription.status == 'active' ? (
                    <p>
                      Your next bill is ${subscription.total} due on{' '}
                      {new Date(subscription.endDate).toDateString()}
                    </p>
                  ) : (
                    <></>
                  )}
                </DetailsBlock>
                {subscription.status === `active` ? (
                  <ButtonSelect
                    style={{ color: 'yellow' }}
                    onClick={() => handleCancel(subscription)}
                  >
                    Cancel
                  </ButtonSelect>
                ) : subscription.paymentStatus !== `paid` ? (
                  <ButtonSelect
                    style={{ color: 'yellow' }}
                    onClick={() => handleRetryCheckout(subscription)}
                  >
                    Pay
                  </ButtonSelect>
                ) : (
                  <></>
                )}
              </div>
            </SubcriptionOrder>
          ))}
          {subscriptions.length === 0 &&
            plans
              .filter((p) => !p.free)
              .map((p, i) => (
                <SubcriptionOrder key={i}>
                  <div className="subcription-header">
                    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span
                          style={{
                            color: 'rgb(17, 17, 17)',
                            fontWeight: '700',
                            fontSize: '20px',
                            lineHeight: '26px',
                          }}
                        >
                          {p.name}
                        </span>
                        {/* <AutoRenew>AUTO RENEWS</AutoRenew> */}
                      </div>
                    </div>
                    <span className="description">
                      Best for remote teams collaborating day-to-day
                    </span>
                  </div>
                  <div className="subcription-body">
                    <PriceBlock>
                      <div className="price-text">
                        {isAnnually ? `$${p.annuallyPrice} USD` : `$${p.monthlyPrice} USD`}
                      </div>
                      <span className="desc">{isAnnually ? '/year' : '/month'}</span>
                    </PriceBlock>
                    <BillOptionsBlock>
                      <div className="title" style={{ opacity: isAnnually ? '1' : '0.6' }}>
                        <span>Billed annually</span>
                      </div>
                      <div className="discount-text">
                        {`-${(((p.monthlyPrice * 12) / p.annuallyPrice - 1) * 100).toFixed(0)}%`}
                      </div>
                      {/* <AntSwitch defaultChecked inputProps={{ 'aria-label': 'ant design' }} /> */}
                      <IOSSwitch
                        checked={isAnnually}
                        onClick={() => setIsAnnually(!isAnnually)}
                        sx={{ m: 1 }}
                      />
                      <div className="desc" style={{ opacity: !isAnnually ? '1' : '0.6' }}>
                        Monthly
                      </div>
                    </BillOptionsBlock>
                    <div>
                      <p className="price-text">Max room: {p.maxRoom}</p>
                      <p className="price-text">Max people in room: {p.maxRoomCapacity}</p>
                    </div>
                    <DetailsBlock>
                      {p.features.map((f, i) => (
                        <p key={i}>{f}</p>
                      ))}
                    </DetailsBlock>
                    <ButtonSelect onClick={() => handleCheckout(p)}>Purchase</ButtonSelect>
                  </div>
                </SubcriptionOrder>
              ))}
        </div>
      </ContentBody>
    </>
  )
}
