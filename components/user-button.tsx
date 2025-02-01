import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { NewNoteDialog } from './new-note-dialog';
import { useQueryClient } from '@tanstack/react-query';

export function UserButton() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: user } = useSession();

  const onSignOut = async () => {
    await signOut({
      redirect: false,
    });
    router.push('/');
    queryClient.invalidateQueries();
  };

  return (
    <div className="flex flex-1 items-center justify-end space-x-4">
      {user ? (
        <>
          <NewNoteDialog />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Open user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push('/my-notes')}>
                My notes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSignOut()}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <Link href="/login">
          <Button>Sign in</Button>
        </Link>
      )}
    </div>
  );
}
