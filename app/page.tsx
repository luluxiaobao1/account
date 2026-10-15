const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const target = `${basePath}/accountadmin/`;

export default function Home() {
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content={`0;url=${target}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.location.replace('${target}');`,
          }}
        />
      </head>
      <body>
        <p>正在跳转到管理页面...</p>
        <p>如果没有自动跳转，请<a href={target}>点击这里</a></p>
      </body>
    </html>
  );
}
