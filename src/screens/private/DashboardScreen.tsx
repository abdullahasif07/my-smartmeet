import { Calendar } from '@/components/ui/calendar';
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
import { useEffect, useState } from 'react';
import { avatars } from '@/constants';
import { LogOut, Settings } from 'lucide-react';

// schema: channel_name
const formSchema = z.object({
  channelName: z.string().min(1, { message: 'Channel name is required' }),
})

const DashboardScreen = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [signoutApi, { isLoading }] = useSignoutMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="flex gap-8 min-h-screen bg-gradient-to-r from-[#41c3dc] via-[#51d179] to-[#54d45a] px-40 py-8">
      <div className="w-1/2 grow flex flex-col justify-between gap-8 py-8">
        <div className="border rounded-3xl border-black py-8 grow h-12">
          <h1 className="text-5xl text-center text-white">
            {time}
          </h1>
        </div>
        <div className="flex items-center justify-center border rounded-3xl border-black py-8 grow">
          <Calendar className='text-white' />
        </div>
      </div>
      <div className="w-1/2 border border-black rounded-3xl py-8 px-4 flex flex-col gap-8 justify-between">
        <div className="flex items-center gap-2">
          <img src={avatars[user?.account.avatar || 0].src} alt="avatar" className="w-16 h-16 rounded-full" />
          <h1
            className="text-5xl text-white"
          >
            {user?.account.name}
          </h1>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex items-start gap-4'>
          <div className='grid gap-1 w-full'>
            <Input
              type="text"
              placeholder="Channel Name"
              className='rounded-3xl'
              {...form.register('channelName')}
            />
            <div className="h-8">
              {form.formState.errors.channelName && (
                <span className="text-red-500">
                  {form.formState.errors.channelName.message}
                </span>
              )}
            </div>
          </div>
          <Button
            type="submit"
            className='rounded-3xl'
            disabled={form.formState.isSubmitting}
          >
            Connect
          </Button>
        </form >
        <div className='flex items-center gap-4 self-end'>
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
          >
            <LogOut size={30} className='text-white' />
          </button>
          <button
            onClick={() => {
              navigate('/settings');
            }}
          >
            <Settings size={30} className='text-white' />
          </button>
        </div>
      </div >
    </div >
  );
};

export default DashboardScreen;
