import Document, { Html, Head, Main, NextScript } from 'next/document'

class CustomDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
        <meta charset='utf-8' />
        <meta http-equiv='X-UA-Compatible' content='IE=edge' />
        <meta name='viewport' content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no' />
        <meta name='description' content='Description' />
        <meta name='keywords' content='Keywords' />
        <title>Next.js PWA Example</title>
        <meta name="theme-color" content="default"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
        <meta name="apple-mobile-web-app-title" content="PWA 테스트"/>
        <link rel="apple-touch-icon" href="./icons/icon_192x192.png"/>
        <link rel="manifest" href="/manifest.json"/>
        <link rel="shortcut icon" href="/favicon.ico" />
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=UA-166898544-1`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-166898544-1');
          `
            }}
          />
          <link
            rel="preload"
            as="font"
            crossOrigin="anonymous"
            href="https://cdn.jsdelivr.net/font-iropke-batang/1.2/IropkeBatangM.woff"
          />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/font-iropke-batang/1.2/font-iropke-batang.css"
          />
          <link
            href="//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSans-kr.css"
            rel="stylesheet"
            type="text/css"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
        <style jsx global>{`
          * {
            font-family: 'Iropke Batang', serif;
          }
          body {
            transition: background-color 0.5s;
          }
        `}</style>
      </Html>
    )
  }
}

export default CustomDocument
