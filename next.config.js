/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Top-level await 사용을 위한 webpack 설정
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    }
    return config
  },
  // FastAPI를 위한 rewrites 설정
  rewrites: async () => {
    return [
      {
        source: "/api/py/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/:path*"
            : "/api/",
      },
      {
        source: "/docs",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/docs"
            : "/api/py/docs",
      },
      {
        source: "/openapi.json",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/openapi.json"
            : "/api/py/openapi.json",
      },
    ]
  },
}

module.exports = nextConfig
