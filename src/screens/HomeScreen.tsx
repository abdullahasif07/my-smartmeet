import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { clearAuth } from "@/features/auth/authSlice";
import { useSignoutMutation } from "@/services/user/userApiSlice";
import { toast } from "sonner";

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const [signoutApi, { isLoading }] = useSignoutMutation();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="mx-auto w-screen min-h-screen px-40">
      <div className="py-2">
        <div className="flex h-16 justify-between items-center">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <img
                className="block h-8 w-auto"
                src="/favicon.png"
                alt="Smart Meet"
              />
            </div>
          </div>
          <Button variant={"outline"}
            disabled={isLoading}
            onClick={async () => {
              try {
                await signoutApi().unwrap();
                dispatch(clearAuth());
                toast.success('Logged out successfully!');
              } catch (error) {
                toast.error('Failed to logout!');
              }
            }}

          >Signout</Button>
        </div>
      </div>
      <div>
        <main>
          <h2 className="text-center">Protected Route!</h2>
          <pre>
            <code>
              {JSON.stringify(user, null, 2)}
            </code>
          </pre>
        </main>
      </div>
    </div>
  );
};

export default HomeScreen;
