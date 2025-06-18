import SignInButton from "./button";


export default async function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World agent</h1>
        <SignInButton/>
      </div>
    </div>
  )
}
