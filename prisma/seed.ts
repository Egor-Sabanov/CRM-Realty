import "dotenv/config";
import {PrismaPg} from "@prisma/adapter-pg";
import {PrismaClient} from "../src/generated/prisma/client";
const prisma=new PrismaClient({adapter:new PrismaPg({connectionString:process.env.DATABASE_URL!})});
async function main(){
 const agents=[{id:"agent-anna",name:"Анна Волкова",initials:"АВ",color:"#c5f36a"},{id:"agent-mikhail",name:"Михаил Орлов",initials:"МО",color:"#8eb6e6"},{id:"agent-elena",name:"Елена Смирнова",initials:"ЕС",color:"#d5a1d9"}];
 for(const a of agents)await prisma.agent.upsert({where:{id:a.id},update:a,create:a});
 const homes=[
 {title:"Квартира с видом на парк",type:"APARTMENT" as const,status:"AVAILABLE" as const,address:"Москва, ул. Усачёва, 19",district:"Хамовники",price:28400000,area:74,rooms:3,floor:8,image:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",description:"Светлая квартира с панорамным видом и продуманной планировкой."},
 {title:"Тихая резиденция у воды",type:"APARTMENT" as const,status:"AVAILABLE" as const,address:"Москва, наб. Академика Туполева, 15",district:"Басманный",price:19800000,area:58,rooms:2,floor:5,image:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",description:"Камерный дом, спокойный двор и удобный доступ к центру."},
 {title:"Дом в сосновом квартале",type:"HOUSE" as const,status:"RESERVED" as const,address:"Московская область, Николина Гора",district:"Одинцовский округ",price:52600000,area:216,rooms:5,floor:2,image:"https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=85",description:"Дом с террасой на участке среди сосен."},
 {title:"Лофт для жизни и работы",type:"APARTMENT" as const,status:"AVAILABLE" as const,address:"Москва, ул. Нижняя Сыромятническая, 10",district:"Басманный",price:16700000,area:63,rooms:2,floor:3,image:"https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",description:"Функциональное пространство в отреставрированном квартале."},
 {title:"Семейная квартира у сада",type:"APARTMENT" as const,status:"SOLD" as const,address:"Москва, ул. Малая Пироговская, 8",district:"Хамовники",price:33900000,area:91,rooms:4,floor:6,image:"https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85",description:"Просторная планировка рядом с парком и школой."}
 ];
 const ids:string[]=[];for(const h of homes){const p=await prisma.property.upsert({where:{title:h.title},update:h,create:h});ids.push(p.id);}
 const examples=[
 {name:"Мария Белова",phone:"+7 916 204-18-42",email:"m.belova@example.ru",source:"Рекомендация",budget:30000000,status:"VIEWING" as const,propertyId:ids[0],agentId:agents[0].id,notes:"Просмотр в субботу после 14:00. Важен тихий двор."},
 {name:"Илья Романов",phone:"+7 903 581-27-60",email:"i.romanov@example.ru",source:"Сайт",budget:21000000,status:"CONTACTED" as const,propertyId:ids[1],agentId:agents[1].id,notes:"Обсудили ипотеку, отправить расчёт к четвергу."},
 {name:"Софья Крылова",phone:"+7 925 440-76-13",email:"s.krylova@example.ru",source:"Площадка объявлений",budget:55000000,status:"OFFER" as const,propertyId:ids[2],agentId:agents[2].id,notes:"Подготовить встречное предложение по срокам передачи."},
 {name:"Денис Фёдоров",phone:"+7 999 162-08-31",email:null,source:"Звонок",budget:18000000,status:"NEW" as const,propertyId:ids[3],agentId:agents[0].id,notes:"Ищет лофт с отдельной рабочей зоной."},
 {name:"Ольга Миронова",phone:"+7 916 721-93-08",email:"o.mironova@example.ru",source:"Рекомендация",budget:34000000,status:"DEAL" as const,propertyId:ids[4],agentId:agents[1].id,notes:"Согласованы основные условия. Ожидаем документы."}
 ];
 for(const x of examples)if(!await prisma.lead.findFirst({where:{phone:x.phone}})){const {propertyId,agentId,...data}=x;const l=await prisma.lead.create({data:{...data,property:{connect:{id:propertyId}},agent:{connect:{id:agentId}}}});await prisma.leadActivity.create({data:{leadId:l.id,message:"Первичный контакт зафиксирован"}});}
}
main().finally(()=>prisma.$disconnect());