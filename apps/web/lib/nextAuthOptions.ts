import { AuthOptions, getServerSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import dbConnect from "./mongodb"
import bcrypt from "bcryptjs"
// import { getUser, registerAfterSignIn } from "@/actions/actions"
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"
import User from "@/models/users"
import { getUserService, registerAfterSignInService } from "@/services/userService"
import { getUserPermissionsService } from "@/services/permissionService"
// import { getUserPermissions } from "@/services/permissionService"

const nextAuthOptions : AuthOptions = {
    useSecureCookies:true,
    providers :[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID?? "",
            clientSecret: process.env?.GOOGLE_CLIENT_SECRET ?? ""
        }),
        Credentials({
            credentials: {
                email : {
                    label: "Email", type : "text"
                },
                password: {label: "Password", type : "password" }
            },
            authorize : async (credentials, req) => { // not using since only google sign in
                await dbConnect()
                const userDoc = await User.findOne({
                    email: credentials?.email,
                    active: false
                }).select("+password")

                if(!userDoc) {
                    const userEmail = await User.findOne({
                        email: credentials?.email
                    }).select("+password")
                    if(!userEmail) {
                        await registerAfterSignInService(credentials)
                    }
                    return null
                    // throw new Error("Email not found! Please register")
                }
                if(!credentials?.password) {
                    throw new Error ("Password is empty")
                }
                if(userDoc.password) {
                    const match = await bcrypt.compare(
                        credentials?.password,
                        userDoc.password
                    )
                    if (!match) {
                        return null
                    }
                }

                // Convert Mongoose document to plain object and ensure required fields
                const user = userDoc.toObject()
                return {
                    id: userDoc.id ?? userDoc._id.toString(),
                    ...user
                }
            } ,
        })
    ],
    session : {
        strategy : "jwt"
    },
    callbacks: {
        async jwt({token, user, account}) { // returns token to the client
            await dbConnect()
            // console.dir({'jwt callbacks' : 'jwt', token, user, account})
            if(token?.user_id) {
                return {...token,  permissions : await getUserPermissionsService(token.user_id.toString())}
            }

            const dbUser = await User.findOne({email: token?.email})
            if(dbUser) {
                token = {
                    ...token,
                    ...dbUser.toJSON(),
                    user_id : dbUser.id.toString(),
                    _id : dbUser._id.toString(),
                    permissions : await getUserPermissionsService(dbUser.id.toString(), true)
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
            const checkUser = await User.findOne({email: user.email})
            if(!checkUser) {
                await registerAfterSignInService(user)
            }
            if(checkUser ) {
                await getUserPermissionsService(checkUser._id.toString(), true)
            }
            const dbUser = await User.findOne({email: user.email, login: true})
            // Only allow sign in if dbUser exists (i.e., user is allowed to login)
            return !!dbUser
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
    // pages: {
    //     signIn : "/auth/signin",
    //     signOut: "/auth/signout",
    //     error: "/auth/error",
    //     verifyRequest: "/auth/verify-request",
    //     newUser : "/auth/new-user"
    // },
    logger : {
        error(code, metadata){
            // console.dir({
            //     'error' : 'error', code, metadata
            // })
        },
        warn(code) {
            // console.dir({
            //     'warn' : 'warn', code
            // })
        },
        debug(code, metadata) {
            // console.dir({
            //     'debug' : 'debug', code, metadata
            // })
        }
    }
}

export default nextAuthOptions

export async function auth(...args :  [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []) {
        await dbConnect()
        const user =  await getServerSession(...args, nextAuthOptions)
        let dbUser = null
        if(user) {
            dbUser = await getUserService(user?.user_id+"")
            if(dbUser) {
                return {...user, ...dbUser.toJSON()}
            }
            return {...user}
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