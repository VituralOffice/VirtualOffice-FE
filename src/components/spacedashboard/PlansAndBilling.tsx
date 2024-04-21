import styled from 'styled-components'
import { AntSwitch } from '../switches/CustomSwitches'

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
        font-family: "DM Sans", sans-serif;
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

        &>span {
            color: rgb(51, 58, 100);
            font-weight: 500;
            font-size: 15px;
            line-height: 20px;
        }
    }
    .discount-text{
        display: flex;
        padding: 2px 4px;
        align-items: flex-start;
        gap: 8px;
        border-radius: 8px;
        background: rgba(144, 173, 255, 0.3);
        &>span {
            color: rgb(67, 88, 216);
            font-weight: 500;
            font-size: 15px;
            line-height: 20px;
        }
    }
    .desc {
        display: flex;
        opacity: 0.6;
        &>span{
            color: rgb(51, 58, 100);
            font-weight: 500;
            font-size: 15px;
            line-height: 20px;
        }
    }
`

export default function PlansAndBilling() {
  return (
    <>
      <ContentHeader>
        <div className="space-name">Space Name</div>
        <div style={{ display: 'flex', marginBottom: '16px', gap: '8px' }}>
          <LinkButton>Enter Space</LinkButton>
        </div>
      </ContentHeader>

      <ContentBody>
        <div>
          <SubcriptionOrder>
            <div className="subcription-header">
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
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
                <PriceBlock>
                    <div className='price-text'>$99.99 USD</div>
                    <span className='desc'>/month /person</span>
                </PriceBlock>
                <BillOptionsBlock>
                    <div className='title'><span>Billed annually</span></div>
                    <div className='discount-text'>-15%</div>
                    {/* <AntSwitch /> */}
                    <div className='desc'>Monthly</div>
                </BillOptionsBlock>
            </div>
          </SubcriptionOrder>
        </div>
      </ContentBody>
    </>
  )
}
