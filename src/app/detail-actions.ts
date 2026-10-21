"use server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {z} from "zod";
import {requireSession} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
const schema=z.object({id:z.string().min(1),title:z.string().min(4),address:z.string().min(4),district:z.string().min(2),price:z.coerce.number().int().positive(),area:z.coerce.number().positive(),rooms:z.coerce.number().int().min(0),floor:z.preprocess(v=>v===""?undefined:v,z.coerce.number().int().positive().optional()),image:z.string().url(),description:z.string().min(10),type:z.enum(["APARTMENT","HOUSE","PLOT","COMMERCIAL"])});
export async function updatePropertyDetails(data:FormData){await requireSession();const result=schema.safeParse(Object.fromEntries(data));if(!result.success)redirect("/properties?error=property");const {id,floor,...values}=result.data;await prisma.property.update({where:{id},data:{...values,floor:floor??null}});revalidatePath("/properties");revalidatePath("/dashboard");redirect("/properties/"+id+"?saved=1");}
const leadSchema=z.object({id:z.string().min(1),status:z.enum(["NEW","CONTACTED","VIEWING","OFFER","DEAL","CLOSED"]),agentId:z.string(),propertyId:z.string(),notes:z.string()});
export async function updateLeadDetails(data:FormData){await requireSession();const result=leadSchema.safeParse(Object.fromEntries(data));if(!result.success)redirect("/leads");const {id,agentId,propertyId,notes,status}=result.data;await prisma.lead.update({where:{id},data:{status:status as "NEW",agentId:agentId||null,propertyId:propertyId||null,notes}});await prisma.leadActivity.create({data:{leadId:id,message:"Карточка клиента обновлена"}});revalidatePath("/leads");revalidatePath("/dashboard");redirect("/leads/"+id+"?saved=1");}
export async function deleteProperty(data:FormData){await requireSession();const id=String(data.get("id")??"");if(!id||data.get("confirm")!=="delete")redirect("/properties");await prisma.property.delete({where:{id}});revalidatePath("/properties");revalidatePath("/leads");revalidatePath("/dashboard");redirect("/properties?saved=1");}
export async function deleteLead(data:FormData){await requireSession();const id=String(data.get("id")??"");if(!id||data.get("confirm")!=="delete")redirect("/leads");await prisma.lead.delete({where:{id}});revalidatePath("/leads");revalidatePath("/dashboard");redirect("/leads?saved=1");}
