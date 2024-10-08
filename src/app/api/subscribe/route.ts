
import { PrismaClient } from "@prisma/client";
import { authUser } from "lib/authUser";
import { NextResponse } from "next/server";



const prisma = new PrismaClient();

export async function GET(){
    
  const authenticatedUser: any = (await authUser()).user;

    const subscribe = await prisma.subscription.findMany({
        where:{senderId:parseInt(authenticatedUser.id)},
        include:{
          receiver:true
        }
    })
    
    const users = subscribe.map(subscribe => subscribe.receiver)

    return NextResponse.json({users});
}
