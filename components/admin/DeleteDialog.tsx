'use client';
import { useState } from 'react';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../ui/alert-dialog';
import {Trash2} from "lucide-react";
import {ActionResponse} from "@/types/action.type";


interface DeleteDialogProps {
    id?: string;
    slug?: string;
    action: (id: string) => Promise<ActionResponse<string | undefined | null>>
    title?: string; // Кастомный заголовок для диалога
}

const DeleteDialog = ({id='ui', slug='', action, title}: DeleteDialogProps) => {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleDeleteClick = () => {
        startTransition(async () => {
            const target = id === 'ui' ? slug : id;
            const res = await action(target);

            if (!res.success) {
                toast.error('Ошибка!', {
                    description: res.message,
                });
            } else {
                setOpen(false);
                toast.success('Успешно!', {
                    description: res.message,
                });
            }
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button size='sm' variant='ghost' className='ml-2'>
                    <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {title || "This action cannot be undone"}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                        variant="destructive"
                        disabled={isPending}
                        onClick={handleDeleteClick}
                        className="text-white"
                    >
                        {isPending ? 'Удаление...' : 'Удалить'}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteDialog;