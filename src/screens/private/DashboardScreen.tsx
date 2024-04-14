import { Calendar } from '@/components/ui/calendar';
import '@/dashboard.css';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useSignoutMutation } from '@/services/user/userApiSlice';
import { toast } from 'sonner';
import { clearAuth } from '@/features/auth/authSlice';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Input } from '@/components/ui/input';

// schema: channel_name
const formSchema = z.object({
  channelName: z.string().min(1, { message: 'Channel name is required' }),
})

const DashboardScreen = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [signoutApi, { isLoading }] = useSignoutMutation();
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channelName: '',
    },
  })

  const connectToVideo = (channelName: string) => {
    navigate(`/via/${channelName}`)
  }


  function onSubmit(data: z.infer<typeof formSchema>) {
    const channelName = data.channelName;
    connectToVideo(channelName)
  }

  return (
    <div className="flex-container">
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-max px-8 py-8 border rounded shadow flex gap-2'>
        <div className='grid gap-1'>
          <Input
            type="text"
            placeholder="Channel Name"
            {...form.register('channelName')}
          />
          {/* show error message take space always */}
          <div className="h-8">
            {form.formState.errors.channelName && (
              <span className="text-red-500 text-sm">
                {form.formState.errors.channelName.message}
              </span>
            )}
          </div>
        </div>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          Connect
        </Button>
      </form >
      {/* <div className="boxes-column">
        <div className="flex items-center justify-center w-60 h-20">
          <Button>Create Meeting</Button>
        </div>
        <div className="flex items-center justify-center w-60 h-20">
          <Button
            variant='outline'
            onClick={() => {
              navigate('/lobby');
            }}
          >Join Meeting</Button>
        </div>
      </div> */}
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
