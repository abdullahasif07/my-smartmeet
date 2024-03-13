import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { avatars } from "@/constants";
import { clearAuth } from "@/features/auth/authSlice";
import { useSignoutMutation } from "@/services/user/userApiSlice";
import { LogOutIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Navbar = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [signoutApi] = useSignoutMutation();

  return (
    <div className="py-2">
      <div className="flex h-16 justify-between items-center">
        <div className="flex">
          <div className="flex flex-shrink-0 items-center">
            <Link to='/'>
              <img
                className="block h-12 w-auto"
                src="/favicon.png"
                alt="Smart Meet"
              />
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to='/settings'>
            <img src={avatars[user?.account.avatar || 0].src} alt="avatar" className="w-12 h-12 rounded-full" />
          </Link>
          <LogOutIcon
            className="rounded-full h-12 w-12 cursor-pointer"
            onClick={async () => {
              try {
                await signoutApi().unwrap();
                dispatch(clearAuth());
                toast.success('Logged out successfully!');
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } catch (error: any) {
                toast.error(
                  error?.data?.message || error.error || 'Error: Something went wrong!'
                );
                console.log(error);
              }
            }}

          >
          </LogOutIcon>
        </div>
      </div>
    </div>
  )
}

export default Navbar