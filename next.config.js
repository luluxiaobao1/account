/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
    output: isGitHubPages ? 'export' : undefined,
    basePath: isGitHubPages ? '/account' : '',
    trailingSlash: true,
    images: {
        unoptimized: true,
    },
};

module.exports = nextConfig;
