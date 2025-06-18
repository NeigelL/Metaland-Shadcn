import dbConnect from "@/lib/mongodb"
import User from "@/models/users"


export const registerAfterSignInService = async(user: any) => {
  await dbConnect()
   const checkUser = await User.findOne({
    email: user.email
  })

  if(!checkUser) {
    const newUser = await User.create({
      email: user.email,
      first_name : user.name,
      middle_name: " ",
      last_name : " ",
      active: true,
      account_type:"buyer",
      login:false
    })
    return newUser
  }
  return checkUser
  
}

export const getUserService = async(user_id:string) => {
  await dbConnect()
  return await User.findById(user_id)
}