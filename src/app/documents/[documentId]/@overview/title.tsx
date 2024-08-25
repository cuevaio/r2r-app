'use client';

import { useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { Input } from '@/components/ui/input';

import { changeTitle } from './change-title.action';

export const Title = ({ children }: { children: string }) => {
  const params = useParams<{ documentId: string }>();

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      formData.append('documentId', params.documentId);
      const result = await changeTitle(formData);

      if (!result.success) throw new Error(result.error);
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  return (
    <form action={mutate}>
      <Input
        name="title"
        defaultValue={children}
        className="h-min border-0 p-0 text-lg font-bold leading-tight"
        disabled={isPending}
      />
    </form>
  );
};
