const nextConfig = {
  reactStrictMode: false,
  serverExternalPackages: ["pdfkit", "fontkit"],
  experimental: {
    serverComponentsExternalPackages: ["pdfkit", "fontkit"],
  },
};

module.exports = nextConfig;
