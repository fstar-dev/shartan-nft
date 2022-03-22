import React, { useState } from 'react'
import { ThemeProvider as SCThemeProvider } from 'styled-components'
import { light, dark } from '@pantherswap-libs/uikit'

const CACHE_KEY = 'IS_DARK'

;
const ThemeContextProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // const isDarkUserSetting = localStorage.getItem(CACHE_KEY)
    // return isDarkUserSetting ? JSON.parse(isDarkUserSetting) : false
    return true;
  })

  const toggleTheme = () => {
    setIsDark((prevState) => {
      localStorage.setItem(CACHE_KEY, JSON.stringify(!prevState))
      return !prevState || true;
    })
  }

  return (
    <SCThemeProvider theme={isDark ? dark : light}>{children}</SCThemeProvider>
  )
}

export { ThemeContextProvider }