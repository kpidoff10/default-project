import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
  // Configuration pour gérer les packages externes et éviter les conflits
  experimental: {
    serverComponentsExternalPackages: ['keyv', '@keyv/redis', '@keyv/mongo', '@keyv/sqlite', '@keyv/postgres', '@keyv/mysql', '@keyv/etcd', '@keyv/offline', '@keyv/tiered'],
  },
  // Configuration webpack pour éviter les conflits de versions
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('keyv');
    }
    return config;
  },
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);