import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useChangePasswordMutation, useUpdateProfileMutation } from '@/services/user/userApiSlice'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from 'sonner'
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DialogClose } from "@radix-ui/react-dialog";
import { avatars } from "@/constants";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { setAuth } from "@/features/auth/authSlice";
import Navbar from "@/components/Navbar";


const profileSchema = z.object({
  name: z.string().min(3, { message: 'Invalid name' }),
  avatar: z.number().int().min(0, { message: 'Invalid avatar' }),
})

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, { message: 'Required' }),
  newPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
  confirmPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
})


const PersonalInformation = () => {
  const { user } = useAppSelector((state) => state.auth);
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.account.name || '',
      avatar: user?.account.avatar || 0,
    },
  })

  const selectedAvatar = form.watch('avatar');

  const [updateProfileApi, { isLoading }] = useUpdateProfileMutation();
  const dispatch = useAppDispatch();

  async function onSubmit(data: z.infer<typeof profileSchema>) {
    const { name, avatar } = data;
    try {
      const res = await updateProfileApi({
        name,
        avatar,
      }).unwrap();
      console.log('update profile', res);
      dispatch(setAuth(res));
      toast.success('Profile updated successfully!');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error?.data?.message || error.error || 'Error: Something went wrong!'
      );
      console.log(error);
    }
  }

  return (
    <div className="flex justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Profile</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          This information will be displayed publicly so be careful what you share.
        </p>
      </div>
      <div className="sm:w-full sm:max-w-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type='text' autoComplete='name' placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="avatar"
                render={() => (
                  <FormItem>
                    <FormLabel>Avatar</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <img src={avatars[selectedAvatar].src} alt="avatar" className="w-12 h-12 rounded-full" />
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant={'outline'} className="bg-transparent">
                              Change
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader className="space-y-4">
                              <DialogTitle className="text-center font-semibold text-xl">Choose Avatar</DialogTitle>
                              <DialogDescription>
                                <div className="flex flex-wrap items-center gap-4">
                                  {
                                    avatars.map((avatar, index) => (
                                      <DialogClose asChild key={index}>
                                        <div className="flex items-center gap-4" onClick={
                                          () => {
                                            form.setValue('avatar', index)
                                          }
                                        }>
                                          <img src={avatar.src} alt="avatar" className={cn("w-12 h-12 rounded-full", {
                                            'border-2 border-blue-500': index === selectedAvatar
                                          })} />
                                        </div>
                                      </DialogClose>
                                    ))
                                  }
                                </div>
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>

                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button disabled={isLoading} className="self-end">Update Profile</Button>
          </form>
        </Form>
      </div>
    </div >
  )
}

const ChangePassword = () => {
  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const [changePasswordApi, { isLoading }] = useChangePasswordMutation();

  async function onSubmit(data: z.infer<typeof changePasswordSchema>) {
    const { oldPassword, newPassword, confirmPassword } = data;
    try {
      const res = await changePasswordApi({
        oldPassword,
        newPassword,
        confirmPassword,
      }).unwrap();
      console.log('changed password', res);
      toast.success('Password changed successfully!');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error?.data?.message || error.error || 'Error: Something went wrong!'
      );
      console.log(error);
    }
  }

  return (
    <div className="flex justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Change Password</h2>
      </div>
      <div className="sm:w-full sm:max-w-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <div>
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Old Password</FormLabel>
                    <FormControl>
                      <Input type='password' autoComplete='old-password' placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type='password' autoComplete='new-password' placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type='password' autoComplete='confirm-password' placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button disabled={isLoading} className="self-end">Change Password</Button>
          </form>
        </Form>
      </div>
    </div>

  )
}

export default function Example() {
  return (
    <main className="min-h-screen px-40">
      <Navbar />
      <div className="mx-auto flex flex-col gap-10 my-10">
        <PersonalInformation />
        <Separator />
        <ChangePassword />
      </div>
    </main>
  )
}
