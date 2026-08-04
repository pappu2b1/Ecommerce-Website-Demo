import {createContext,useContext,useEffect,useMemo,useState} from 'react';
import {api} from '../services/api';
const Store=createContext(null);
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))||fallback}catch{return fallback}};
export function StoreProvider({children}){
  const[cart,setCart]=useState(()=>read('luma-cart-v2',[]));
  const[wishlist,setWishlist]=useState(()=>read('luma-wishlist',[]));
  const[user,setUserState]=useState(()=>read('luma-user',null));
  const[wishlistReady,setWishlistReady]=useState(false);
  useEffect(()=>localStorage.setItem('luma-cart-v2',JSON.stringify(cart)),[cart]);
  useEffect(()=>{if(!user)localStorage.setItem('luma-wishlist',JSON.stringify(wishlist))},[wishlist,user]);
  useEffect(()=>localStorage.setItem('luma-user',JSON.stringify(user)),[user]);
  useEffect(()=>{let live=true;if(!user){setWishlistReady(true);return}const guest=read('luma-wishlist',[]);api('/wishlist').then(async r=>{const merged=[...new Set([...r.products,...guest])];if(merged.length!==r.products.length)await api('/wishlist',{method:'PUT',body:JSON.stringify({products:merged})});if(live){setWishlist(merged);localStorage.setItem('luma-wishlist','[]');setWishlistReady(true)}}).catch(()=>{if(live)setWishlistReady(true)});return()=>{live=false}},[user?.id]);
  const setUser=value=>{setUserState(value);if(!value){setWishlist([]);setWishlistReady(true)}};
  const add=(product,quantity=1,options={})=>{if(!product?._id||!Number.isFinite(product.price)||product.stock<1)return;setCart(items=>{const key=`${product._id}-${options.size||''}-${options.color||''}`,found=items.find(x=>x.key===key),safe=Math.max(1,Math.min(Number(quantity)||1,product.stock));return found?items.map(x=>x.key===key?{...x,quantity:Math.min(product.stock,x.quantity+safe)}:x):[...items,{key,product,quantity:safe,...options}]})};
  const update=(key,quantity)=>setCart(items=>items.map(x=>x.key===key?{...x,quantity:Math.max(1,Math.min(Number(quantity)||1,x.product.stock))}:x));
  const remove=key=>setCart(items=>items.filter(x=>x.key!==key));
  const toggleWish=async id=>{const previous=wishlist,removing=wishlist.includes(id),next=removing?wishlist.filter(x=>x!==id):[...wishlist,id];setWishlist(next);if(user){try{const r=await api(`/wishlist/${id}`,{method:removing?'DELETE':'POST'});setWishlist(r.products)}catch{setWishlist(previous)}}};
  const value=useMemo(()=>({cart,wishlist,user,setUser,add,update,remove,clear:()=>setCart([]),toggleWish,wishlistReady,count:cart.reduce((s,x)=>s+x.quantity,0),subtotal:cart.reduce((s,x)=>s+x.product.price*x.quantity,0)}),[cart,wishlist,user,wishlistReady]);
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
export const useStore=()=>useContext(Store);
