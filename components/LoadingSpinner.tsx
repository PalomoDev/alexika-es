import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    text?: string;
    size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner = ({
                            text = "Loading...",
                            size = 'md'
                        }: LoadingSpinnerProps) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };

    return (
        <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
                <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
                <p className="text-muted-foreground">{text}</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;