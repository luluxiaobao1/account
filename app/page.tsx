export default function Home() {
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content="0;url=/account/accountadmin/" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.location.href = '/account/accountadmin/';`,
          }}
        />
      </head>
      <body>
        <p>正在跳转到管理页面...</p>
        <p>如果没有自动跳转，请<a href="/account/accountadmin/">点击这里</a></p>
      </body>
    </html>
  );
}
