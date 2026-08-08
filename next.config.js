/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    basePath: "/account",
    trailingSlash: true,
    images: {
        unoptimized: true,
    },
};

module.exports = nextConfig;
