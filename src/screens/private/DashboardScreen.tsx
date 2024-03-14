import { Calendar } from '@/components/ui/calendar';
import '@/dashboard.css';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useSignoutMutation } from '@/services/user/userApiSlice';
import { toast } from 'sonner';
import { clearAuth } from '@/features/auth/authSlice';


const DashboardScreen = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [signoutApi, { isLoading }] = useSignoutMutation();
  const dispatch = useAppDispatch();

  return (
    <div className="flex-container">
      <div className="boxes-column">
        <div className="box small-box"></div>
        <div className="box small-box"></div>
      </div>
      <div className="box large-box">
        <div className="user-info">
          <h1>{user?.account.name}</h1>
          <div className="buttons">
            <button
              onClick={() => {
                navigate('/settings');
              }}
            >Settings</button>
            <button
              disabled={isLoading}
              onClick={async () => {
                try {
                  const res = await signoutApi().unwrap();
                  dispatch(clearAuth());
                  toast.success(res.message);
                  navigate('/sign-in');
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (error: any) {
                  console.log(error);
                }
              }}
            >Logout</button>
          </div>
        </div>
      </div>
      {/* Calendar component */}
      <div className="calendar-container">
        <Calendar />
      </div>
    </div>
  );
};

export default DashboardScreen;
