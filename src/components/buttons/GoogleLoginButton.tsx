import { Button } from '@mui/material'
import React from 'react'
import styled from 'styled-components'

interface GoogleLoginButtonProps {
  onClick: (ev: any) => void
}
const GoogleLogin: React.FC<GoogleLoginButtonProps> = (prop: GoogleLoginButtonProps) => {
  return <Button {...prop}> Sign in with Google </Button>
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
    border: 2px solid rgb(151, 151, 151) !important;
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
    transition: background-color 0.3s, box-shadow 0.3s;
    padding: 12px 16px 12px 42px;
    border: none;
    border-radius: 3px;
    box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 1px 1px rgba(0, 0, 0, 0.25);
    color: #757575;
    font-size: 14px;
    font-weight: 500;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
      'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=);
    background-color: white;
    background-repeat: no-repeat;
    background-position: 12px 11px;
  }
`

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onClick }) => {
  return <GoogleLoginStyled onClick={onClick} />
}

export default GoogleLoginButton
