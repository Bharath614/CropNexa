const nextConfig = {
    output: "export",
    images: {
        unoptimized: true,
    },
    turbopack: {
        root: process.cwd(),
    },
    allowedDevOrigins: ['10.172.241.209', '0.0.0.0', 'localhost', '127.0.0.1'],
};
export default nextConfig;
