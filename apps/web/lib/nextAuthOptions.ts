import { AuthOptions, getServerSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import dbConnect from "./mongodb"
import User from "@/models/users"
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"
import { can, getUserPermissions } from "@/services/permissionService"
import { getUserService, registerAfterSignInService } from "@/services/userService"
import { headers } from "next/headers"



const nextAuthOptions : AuthOptions = {
    useSecureCookies:true,
    // debug: true,
    // cookies: {
    //     callbackUrl: {
    //         name: "next-auth.callback-url",
    //         options: {
    //             httpOnly: true,
    //             sameSite: "lax",
                
    //         }
    //     },
    // },
    providers :[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID?? "",
            clientSecret: process.env?.GOOGLE_CLIENT_SECRET ?? "",
        }),
        // Credentials({
        //     credentials: {
        //         email : {
        //             label: "Email", type : "text"
        //         },
        //         password: {label: "Password", type : "password" }
        //     },
        //     authorize : async(credentials) => { 
        //         // not using since only google sign in
        //         await dbConnect()
        //         const host = await headers()
        //         const user:any = await User.findOne({
        //             email: credentials?.email,
        //             active: false
        //         }).select("+password")

        //         if(!user) {
        //             const userEmail = await User.findOne({
        //                 email: credentials?.email
        //             }).select("+password")
        //             if(!userEmail) {
        //                 await registerAfterSignInService(credentials)
        //             }
        //             return null
        //             // throw new Error("Email not found! Please register")
        //         }
        //         if(!credentials?.password) {
        //             throw new Error ("Password is empty")
        //         }

        //         const match = await bcrypt.compare(
        //             credentials?.password,
        //              user?.password
        //         )

               

        //         return user
        //     } ,
        // })
    ],
    session : {
        strategy : "jwt",
        maxAge: 60 * 60 * 24 // 1 day
    },
    jwt : {
        maxAge: 60 * 60 * 24, // 1 day
    },
    callbacks: {
        // async redirect({url, baseUrl}) {
        //     return url
        // },
        async jwt({token, user, account}) { // returns token to the client
            await dbConnect()
            // console.dir({'jwt callbacks' : 'jwt', token, user, account})
            if(token?.user_id) {
                return {...token,  permissions : await getUserPermissions(token.user_id.toString())}
            }

            const dbUser = await User.findOne({email: token?.email})
            if(dbUser) {
                token = {
                    ...token,
                    ...dbUser.toJSON(),
                    user_id : dbUser.id.toString(),
                    _id : dbUser._id.toString(),
                    permissions : await getUserPermissions(dbUser.id.toString(), true)
                }
            }
            return token
        },
        async session({session, token, user}) { // second token is from jwt callback
            // console.dir({'sessions callbacks' : 'sessions',session, token, user})
            // console.dir('session')
            return {...session, user_id: token?.user_id, ...token}
        },
        async signIn({ user, account, profile}) {
            await dbConnect()
            // console.dir({'signIn callbacks' : 'signIn',user, account, profile})
            const checkUser:any = await User.findOne({email: user.email, login: true})
            const host = await headers()
            if(checkUser && checkUser?._id) {
                await getUserPermissions(checkUser._id.toString(), true)
                // console.dir({'asd' : host.get("host")})
                if( process.env.NEXT_AGENT_DOMAIN  == host.get("host")) {
                    if(await can("role:agent", checkUser._id )) {
                        return checkUser
                    } else {
                        throw new Error("NoRole&msg=agent")
                    }
                }

                 if( process.env.NEXT_BUYER_DOMAIN  == host.get("host")) {
                    if(await can("role:buyer", checkUser._id )) {
                        return checkUser
                    } else {
                        throw new Error("NoRole&msg=buyer")
                    }
                }
                // if( await can("role:office-staff", checkUser._id )  && process.env.NEXT_ADMIN_DOMAIN  == host.get("host")) {
                //     return checkUser
                // }

               
            } else {
                 throw new Error("EmailNotFound&msg="+user?.email)
            }

            return "UnAuthorized " + user?.email
        },
        // async signOut({session, token}) {
        //     console.dir({'signOut' : 'signOut', session, token })
        //     return true
        // },
    },
    events : {
        async signIn(message) {
            // console.dir({'signin events':'signin', message})
        },
        async signOut(message) {
            // console.dir({'signOut events':'signOut', message})
        },
        async createUser(message) {
            // console.dir({'createUser events':'createUser', message})
        },
        async updateUser(message) {
            // console.dir({'updateUser events':'updateUser', message})
        },
        async linkAccount(message){
            // console.dir({'linkAccount events':'linkAccount', message})
        },
        async session(message) {
            // console.dir({'session events':'session', message})
        }
    },
    pages: {
        // signIn : "/auth/signin",
        // signOut: "/auth/signout",
        // error: "/auth/error",
        // verifyRequest: "/auth/verify-request",
        // newUser : "/auth/new-user"
        error: "/auth/error",
    },
    // logger : {
    //     error(code, metadata){
    //         console.dir({
    //             'error' : 'error', code, metadata
    //         })
    //     },
    //     warn(code) {
    //         console.dir({
    //             'warn' : 'warn', code
    //         })
    //     },
    //     debug(code, metadata) {
    //         console.dir({
    //             'debug' : 'debug', code, metadata
    //         })
    //     }
    // }
}

export default nextAuthOptions

export async function auth(...args :  [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []) {
        await dbConnect()
        const user =  await getServerSession(...args, nextAuthOptions)
        let dbUser:any = {}
        if(user) {
            dbUser = await getUserService(user?.user_id+"")
            return await {...user, ...dbUser}
        }
        return user
}

export async function canLogin() {
    const user = await auth()
    return user && user?.login
}

export async function isLogin() {
    await dbConnect()
    const login = await auth()
    return login && login?.user_id
}

