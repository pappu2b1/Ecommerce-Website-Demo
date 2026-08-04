export const site={name:'LUMA',currency:'USD',locale:'en-US',apiUrl:import.meta.env.VITE_API_URL||'http://localhost:5000/api',email:'hello@luma.demo',whatsapp:import.meta.env.VITE_WHATSAPP_NUMBER||'919876543210'};
export const money=(value)=>new Intl.NumberFormat(site.locale,{style:'currency',currency:site.currency}).format(value);
