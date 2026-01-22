/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Export static pour Databricks Apps
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
