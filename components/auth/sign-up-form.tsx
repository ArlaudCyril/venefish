'use client';

import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from 'reactfire';
import { doc, setDoc } from 'firebase/firestore';
import { useMyFirestore } from '@/lib/useMyFirestore';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

interface SignUpFormProps {
  onShowLogin: () => void;
  onSignUp?: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onShowLogin, onSignUp }) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const auth = useAuth();
  const firestore = useMyFirestore();  // Utilisez le hook ici

  const signup = async ({ email, password }: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      console.log('Attempting to create user with email:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created with Firebase Auth');
      const user = userCredential.user;
      if (user?.uid) {
        console.log(`User UID: ${user.uid}`);
        await setDoc(doc(firestore, 'users', user.uid), {
          email: user.email,
          createdAt: new Date(),  // Example additional field
        });
        console.log('User document created in Firestore');
        toast({ title: 'Account created and user added to Firestore!' });
        onSignUp?.();
      }
    } catch (err: any) {
      console.error('Error signing up:', err);
      if ('code' in err && err.code.includes('already')) {
        toast({ title: 'User already exists' });
      } else {
        toast({ title: 'Error signing up', description: `${err}` });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(signup)}>
          <fieldset disabled={isLoading} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormDescription>
                    A valid email is required to watch locked specials.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    Must be at least 8 characters long.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Sign Up</Button>
          </fieldset>
        </form>
      </Form>
      <p className="mt-4 text-sm">
        Already joined?{' '}
        <Button variant="link" onClick={onShowLogin}>
          Sign in instead.
        </Button>
      </p>
    </>
  );
};
