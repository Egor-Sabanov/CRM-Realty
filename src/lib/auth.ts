import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
const name = "crm_session";
function key() { const value=process.env.SESSION_SECRET; if(!value||value.length<32) throw new Error("SESSION_SECRET должен содержать не менее 32 символов"); return new TextEncoder().encode(value); }
export async function createSession(email:string) { const token=await new SignJWT({email}).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(key()); (await cookies()).set(name,token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:604800}); }
export async function getSession() { const token=(await cookies()).get(name)?.value; if(!token)return null; try{return (await jwtVerify(token,key())).payload as {email:string};}catch{return null;} }
export async function requireSession() { const user=await getSession(); if(!user)redirect("/login"); return user; }
export async function destroySession(){(await cookies()).delete(name);}