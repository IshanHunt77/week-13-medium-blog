import { Hono } from 'hono'
import { SignupSchema } from './zod/Signupzod'
import { PrismaClient } from '@prisma/client/extension'
import { env } from 'hono/adapter'
import { withAccelerate } from '@prisma/extension-accelerate'
import { jwt, sign, verify } from 'hono/jwt'



const app = new Hono<{
  Bindings:{
    DATABASE_URL:string,
    JWT_SECRET:string
  }
}>()

app.post('/api/v1/user/signup',async(c)=>{
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const {success,data} = SignupSchema.safeParse(c.req.json())
  if(!success){
    return c.json({
      msg:"Invalid Schema"
    })
  }
  const user = await prisma.user.create({
    username:data.username,
    email:data.email,
    password:data.password
  })
  const jwt  = await sign({id:user.id},c.env.JWT_SECRET)

   return c.json({
    jwt,
    msg:"Signup Successful"
   })
})

app.post('/api/v1/user/signin',async(c)=>{
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const body = await c.req.json()
  await prisma.user.findUnique({
    where:{
      id:body.id
    }
  })
  const response  = await verify(body.id,c.env.JWT_SECRET)
  
  return c.json({})
})

app.post('/api/v1/blog',(c)=>{
  return c.json({})
})

app.put('/api/v1/blog',(c)=>{
  return c.json({})
})

app.get('/api/v1/blog:id',(c)=>{
  return c.json({})
})


app.get('/api/v1/blog/bulk',(c)=>{
  return c.json({})
})


export default app
