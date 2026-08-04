const productionOrigins=[
  'https://luma.papputhakur.com',
  'https://ecommerce-website-demo-zeta.vercel.app',
];

const isProduction=process.env.NODE_ENV==='production'||process.env.RENDER==='true';

export const allowedOrigins=isProduction
  ? productionOrigins
  : [...productionOrigins,'http://localhost:5173'];

export const corsOptions={origin:allowedOrigins,credentials:true};
