/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'firebasestorage.googleapis.com',
            },
            {
                hostname: 'oaidalleapiprodscus.blob.core.windows.net',
            }
        ],
    },
    typescript: {
        ignoreBuildErrors: true
    },
    eslint: {
        ignoreDuringBuilds: true
    }
};

export default nextConfig;
