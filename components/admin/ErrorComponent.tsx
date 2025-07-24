import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ErrorComponentProps {
    message?: string;
    title?: string;
    showBackButton?: boolean;
    backUrl?: string;
}

const ErrorComponent = ({
                            message = "Something went wrong",
                            title = "Error",
                            showBackButton = true,
                            backUrl = "/admin/catalog"
                        }: ErrorComponentProps) => {
    return (
        <div className="wrapper">
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="mb-4">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {title}
                </h1>

                <p className="text-gray-600 mb-6 max-w-md">
                    {message}
                </p>

                {showBackButton && (
                    <Button asChild variant="outline">
                        <Link href={backUrl} className="flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Catalog
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ErrorComponent;