import { SignInForm } from "../components/sign-in-form";

function SignIn() {
  return (
    <>
      <div className="w-full h-screen ">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[610px] w-[20px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
        </div>
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            <SignInForm />
          </div>
        </div>{" "}
      </div>
    </>
  );
}

export default SignIn;
