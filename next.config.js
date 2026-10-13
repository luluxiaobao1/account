/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export',        // 本地开发时注释，部署时取消注释
    // basePath: '/account',    // 本地开发时注释，部署时取消注释
    trailingSlash: true,
    images: {
        unoptimized: true,
    },
};

module.exports = nextConfig;
