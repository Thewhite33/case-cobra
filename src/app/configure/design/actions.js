'use server'

import { db } from "@/db"

export async function saveConfig({color,finish,material,model,configId}){
    await db.configuration.update({
        where:{id:configId},
        data:{color,finish,material,model}
    })
}