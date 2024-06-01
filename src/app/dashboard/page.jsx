import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/db'
import { formatPrice } from '@/lib/utils'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { notFound } from 'next/navigation'
import React from 'react'

const Page = async () => {
    const { getUser } = getKindeServerSession()
    const user = await getUser()
    const admin = process.env.ADMIN_EMAIL
    if (!user || user.email !== admin) {
        return notFound()
    }
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const order = await db.order.findMany({
        where:{
            isPaid:true,
            createdAt:{
                gte:oneWeekAgo //last week order
            }
        },
        orderBy:{
            createdAt:'desc',
        },
        include:{
            user:true,
            shippingAddress:true
        }
    })
    const lastWeekSum = await db.order.aggregate({
        where:{
            isPaid:true,
            createdAt:{
                gte:new Date(new Date().setDate(new Date().getDate()-7)) //last week order
            }
        },
        _sum:{
            amount:true,
        }
    })
    return (
        <div className='flex min-h-screen w-full bg-muted/40'>
            <div className='max-w-7xl w-full mx-auto flex flex-col sm:gap-4 sm:py-4'>
                <div className='flex flex-col gap-16'>
                    <div className='grid gap-4 sm:grid-cols-2'>
                        <Card>
                            <CardHeader className='pb-2'>
                                <CardDescription>Last Week</CardDescription>
                                <CardTitle className='text-4xl'>
                                    {formatPrice(lastWeekSum._sum.amount ?? 0)}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page