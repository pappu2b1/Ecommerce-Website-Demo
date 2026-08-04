export const API_BASE_URL=(import.meta.env.VITE_API_BASE_URL||'http://localhost:5000').replace(/\/+$/,'');
export const site={name:'LUMA',currency:'USD',locale:'en-US',apiUrl:`${API_BASE_URL}/api`,email:'hello@luma.demo',whatsapp:import.meta.env.VITE_WHATSAPP_NUMBER||'919876543210'};
export const money=(value)=>new Intl.NumberFormat(site.locale,{style:'currency',currency:site.currency}).format(value);
