import PropTypes from 'prop-types'
import App from 'next/app'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { CookiesProvider, useCookies } from 'react-cookie'
import { ToastContainer } from 'react-toastify'
import Cookie from 'universal-cookie'
import 'react-toastify/dist/ReactToastify.css'
import ThemeContext from '../src/contexts/ThemeContext'

function ThemeWrapper({ children }) {
  const [cookies, setCookie] = useCookies(['theme'])
  const [theme, setTheme] = useState(cookies.theme || 'light')
  const [isLight, setIsLight] = useState(
    cookies.theme ? cookies.theme === 'light' : true
  )

  useEffect(() => {
    setCookie('theme', theme, { path: '/', maxAge: 60 * 60 * 24 * 365 })
    setIsLight(theme === 'light')
  }, [theme])

  return (
    <>
      <Head>
        <title>🎍 대나무숲 🎍</title>
        // 테마 전환시 깨짐 방지
        <link
          rel="stylesheet"
          href={`https://cdn.jsdelivr.net/gh/kognise/water.css@latest/dist/light.css`}
        />
        <link
          rel="stylesheet"
          href={`https://cdn.jsdelivr.net/gh/kognise/water.css@latest/dist/${theme}.css`}
        />
        <meta name="theme-color" content="status bar color"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="ios status bar color"/>
        <meta name="apple-mobile-web-app-title" content="대숲 베타"/>
        <link rel="apple-touch-icon" href="./icons/icon_192x192.png"/>
        <link rel="shortcut icon" href="./icons/icon_192x192.png"/>
        <link rel="manifest" href="/manifest.json"/>
      </Head>
      <ThemeContext.Provider value={[theme, t => setTheme(t)]}>
        {children}
      </ThemeContext.Provider>
      <ToastContainer />
      <style jsx global>{`
        body {
          background: ${isLight ? '#f3f3f3' : '#202b38'};
        }
        input,
        select,
        textarea,
        button {
          background-color: ${isLight ? '#e8f5e9' : '#161f27'};
        }
        button:hover {
          background-color: ${isLight ? '#a5d6a7' : '#324759'};
        }
        .tag {
          background-color: ${isLight ? '#e8f5e9' : '#161f27'};
        }
        .card,
        .modal,
        form {
          background-color: ${isLight ? '#fff' : '#253542'};
        }
        .card {
          border-color: ${isLight ? '#e8f5e9' : '#161f27'} !important;
        }
        a,
        strong {
          color: ${isLight ? '#4caf50' : '#0076d1'};
        }
        .grecaptcha-badge {
          visibility: hidden;
        }
      `}</style>
    </>
  )
}

ThemeWrapper.propTypes = {
  children: PropTypes.object
}

class CustomApp extends App {
  static async getInitialProps({ Component, ctx }) {

    return {
      pageProps:
        typeof Component.getInitialProps === 'function'
          ? await Component.getInitialProps(ctx)
          : {},
      cookies: new Cookie(ctx.req ? ctx.req.headers.cookie : null)
    }
  }

  render() {
    const { Component, pageProps, cookies } = this.props
    return (
      <CookiesProvider cookies={process.browser ? false : cookies}>
        <ThemeWrapper>
          <Component {...pageProps} />
        </ThemeWrapper>
      </CookiesProvider>
    )
  }
}

export default CustomApp