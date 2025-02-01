import { useToast } from '@hooks/useToast';
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from 'components/ui/toast';

export function Toaster({ variant }: { variant?: 'bottom-left' | 'top-center' | undefined }) {
    const { toasts, dismiss } = useToast();

    return (
        <ToastProvider>
            {toasts.map(function ({ id, title, description, action, position, clickToDismiss, ...props }) {
                return position && variant === position ? (
                    <Toast
                        key={id}
                        {...props}
                        onClick={
                            clickToDismiss
                                ? () => {
                                      dismiss(id);
                                  }
                                : undefined
                        }
                        direction={position === 'bottom-left' ? 'toLeft' : 'toTop'}
                    >
                        <div className="grid gap-1">
                            {title && <ToastTitle>{title}</ToastTitle>}
                            {description && <ToastDescription>{description}</ToastDescription>}
                        </div>
                        {action}
                        <ToastClose />
                    </Toast>
                ) : null;
            })}
            <ToastViewport variant={variant} />
        </ToastProvider>
    );
}
