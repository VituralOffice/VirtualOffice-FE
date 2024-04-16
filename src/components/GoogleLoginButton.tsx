import React from 'react';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import styled from 'styled-components';

interface GoogleLoginButtonProps {
  onSuccess: (response: GoogleLoginResponse | GoogleLoginResponseOffline) => void;
  onFailure: (error: any) => void;
}

const GoogleLoginStyled = styled(GoogleLogin)`
&&& {
    display: flex !important;
    position: relative !important;
    box-sizing: border-box !important;
    outline: none !important;
    -webkit-box-align: center !important;
    align-items: center !important;
    -webkit-box-pack: center !important;
    justify-content: center !important;
    font-family: inherit !important;
    font-weight: 700 !important;
    transition: background-color 200ms ease 0s, border-color 200ms ease 0s !important;
    cursor: pointer !important;
    opacity: 1 !important;
    overflow: hidden !important;
    background-color: transparent !important;
    border: 2px solid rgb(40, 45, 78) !important;
    padding: 0px 16px !important;
    width: auto !important;
    min-width: min(104px, 100%) !important;
    max-width: 100% !important;
    height: 48px !important;
    border-radius: 12px !important;
    font-size: 15px !important;
    color: rgb(40, 45, 78) !important;
    box-shadow: none !important;
    & > div {
        display: flex;
    }
}
`;


const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onSuccess, onFailure }) => {
  return (
    <GoogleLoginStyled
      clientId="YOUR_GOOGLE_CLIENT_ID"
      buttonText="Login with Google"
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={'single_host_origin'}
    />
  );
};

export default GoogleLoginButton;