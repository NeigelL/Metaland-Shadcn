import { AuthOptions, getServerSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import dbConnect from "./mongodb"
import User from "@/models/users"
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"
import { can, getUserPermissions } from "@/services/permissionService"
import { getUserService, registerAfterSignInService } from "@/services/userService"
import { headers } from "next/headers"
import {  getImpersonatedUser, isImpersonationEnabled } from "./impersonate"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { ObjectId } from "mongodb"
import VerificationToken from "@/models/verification_token"



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
        Credentials({
            name : "OTP Login",
            credentials: {
                email : {
                    label: "Email", type : "text"
                },
                code: {label: "Code", type : "text" }
            },
            authorize : async(credentials) => {
                const email = credentials?.email?.toLowerCase().trim();
                const code = credentials?.code?.trim();

                if (!email || !code) return null;

                await dbConnect()
                // find a token for this email that hasn't expired
                const vt = await VerificationToken.findOne({ identifier: email }).sort({ createdAt: -1 });

                if (!vt) return null;
                if (new Date(vt.expires).getTime() < Date.now()) {
                    // expired — cleanup & fail
                    await vt.deleteOne();
                    return null;
                }

                const ok = await bcrypt.compare(code, vt.tokenHash);
                if (!ok) return null;

                // OTP valid — consume token
                await vt.deleteOne();


                let user:any = await User.findOne({ email, login: true }).lean();
                if (user) {
                    user = {
                        ...user,
                        email: user.email,
                        _id: user._id,
                        id: (user._id as ObjectId).toHexString(),
                        name: [user?.first_name, user?.last_name].join(" ")
                    }
                }
                return user as any;
            },
        })
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
             if(isImpersonationEnabled(token?.email || "")) {
                 const impersonatedUser = await getImpersonatedUser()
                if(impersonatedUser !== null) {
                    token = {
                        ...token,
                        ...impersonatedUser,
                        user_id: impersonatedUser._id.toString(),
                        _id: impersonatedUser._id.toString(),
                        permissions : await getUserPermissions(impersonatedUser._id.toString(), true)
                    }
                    return token
                }
            }

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
            //console.dir({'sessions callbacks' : 'sessions',session, token, user})
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
                    if(await can("role:agent", checkUser._id.toString() )) {
                        return checkUser
                    } else {
                        throw new Error("NoRole&msg=agent")
                    }
                }

                if( process.env.NEXT_BUYER_DOMAIN  == host.get("host")) {
                    if(await can("role:buyer", checkUser._id.toString() )) {
                        return checkUser
                    } else {
                        throw new Error("NoRole&msg=buyer")
                    }
                }

                if( process.env.NEXT_REALTY_DOMAIN  == host.get("host")) {
                    if(await can("role:realty-staff", checkUser._id.toString() )) {
                        return checkUser
                    } else {
                        throw new Error("NoRole&msg=realty")
                    }
                }

                if( process.env.NEXT_ADMIN_DOMAIN  == host.get("host")) {
                    if(await can("role:office-staff", checkUser._id.toString() )) {
                        return checkUser
                    } else {
                        throw new Error("NoRole&msg=admin")
                    }
                }
               
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
            if(isImpersonationEnabled(dbUser?.email || "")) {
                 const impersonatedUser = await getImpersonatedUser()
                if(impersonatedUser !== null) {
                    return await {
                        ...impersonatedUser,
                        user_id: impersonatedUser._id.toString(),
                        _id: impersonatedUser._id.toString(),
                        permissions : await getUserPermissions(dbUser.id.toString(), true)
                    }
                }
                return {...user, dbUser}
            }
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

