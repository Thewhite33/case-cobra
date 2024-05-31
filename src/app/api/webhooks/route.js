import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req){
    try {
        const body = await req.text()
        const signature = headers().get("stripe-signature")

        if(!signature){
            return new Response('Invalid signature',{status:400})
        }
        const event = stripe.webhooks.constructEvent(body,signature,process.env.STRIPE_WEBHOOK_SECRET)

        if(event.type === 'checkout.session.completed'){
            if(!event.data.object.customer_details?.email){
                throw new Error('Missing user email')
            }
            const session = event.data.object

            const {userId,orderId} = session.metadata || {
                userId:null,
                orderId:null
            }

            if(!userId || !orderId) {
                throw new Error("Invalid request metadata")
            }
            const BillingAddress = session.customer_details.address
            const ShippingAddress = session.shipping_details.address

            await db.order.update({
                where:{id:orderId},
                data:{isPaid:true,
                    ShippingAddress:{
                        create:{
                            name:session.customer_details.name,
                            city:ShippingAddress.city,
                            country:ShippingAddress.country,
                            postalCode:ShippingAddress.postal_code,
                            street:ShippingAddress.line1,
                            state:ShippingAddress.state
                        }
                },
                BillingAddress:{
                    create:{
                        name:session.customer_details.name,
                        city:BillingAddress.city,
                        country:BillingAddress.country,
                        postalCode:BillingAddress.postal_code,
                        street:BillingAddress.line1,
                        state:BillingAddress.state
                    }
                }
            }
            })
        }
        return NextResponse.json({result:event,ok:true})
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {message:'Something went wrong',ok:false},
            {status:500}
        )
    }
}