import SignOut from "@/components/SignOut";
import User from "@/components/User";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { useRouter } from "next/navigation";

const page = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    return (
      <div>
        <div>welcome to admin {session?.user.username}'s dashboard. </div>
        <SignOut />
        <div className="">client session</div>
        <User/>
      </div>
    );
  }

  return <div>Please log in</div>;
};

export default page;
