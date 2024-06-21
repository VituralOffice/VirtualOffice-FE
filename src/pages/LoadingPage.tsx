import { useEffect, useState } from 'react'
// import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { spinAnimation } from '../anims/CssAnims'
// import { useDispatch } from 'react-redux'
// import { GetUserProfile } from '../apis/UserApis'
// import { getLocalStorage, setLocalStorage } from '../apis/util'
// import { setLoggedIn, setSubcription, setUserInfo } from '../stores/UserStore'
// import { useAppSelector } from '../hook'
// import { USER_LS_KEY } from '../utils/util'
// import { setIsLoading } from '../stores/LoadingStore'
// import { GetHighestMonthlyPriceSubcription } from '../apis/SubcriptionApis'

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: rgb(51, 58, 100);
  & > div {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 600;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    & > div {
      display: flex;
      padding: 40px;
      flex-direction: column;
      position: fixed;
      align-items: center;
      gap: 24px;
    }
  }
`

const Spinner = styled.img`
  width: 70px;
  animation: 1s ease 0s infinite normal none running ${spinAnimation};
`

const LoadingText = styled.span`
  color: rgb(224, 224, 224);
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 15px;
  line-height: 20px;
`

interface LoadingProps {
  loading?: boolean
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>
}

interface LoadingOptions {
  autoHideLoading?: boolean
  autoHideTime?: number
}

const LoadingPage = <P extends object>(
  Component: React.ComponentType<P>,
  options: LoadingOptions = { autoHideLoading: true, autoHideTime: 500 }
) => {
  return (props: P) => {
    const [loading, setLoading] = useState(true)

    const componentProps = {
      ...(props as object),
      loading,
      setLoading,
    } as P & LoadingProps

    useEffect(() => {
      let timeout: any

      if (options.autoHideLoading) {
        timeout = setTimeout(() => {
          setLoading(false)
        }, options.autoHideTime)
      }

      return () => {
        if (timeout) {
          clearTimeout(timeout)
        }
      }
    }, [])

    return (
      <>
        {loading && (
          <Container>
            <div>
              <Spinner src="/logo_transparent.svg" />
              <LoadingText>Loading ...</LoadingText>
            </div>
          </Container>
        )}
        <Component {...componentProps} />
      </>
    )
  }
}

export default LoadingPage
