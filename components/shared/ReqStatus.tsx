import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Inbox } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface ReqStatusProps {
    loading: boolean;
    error: Error | null;
    children: React.ReactNode;
    length?: number;
    colSpan?: number;
    loadingText?: string;
    btn?: React.ReactNode;
    errorText?: string;
    emptyText?: string;
    onRetry?: () => void;
}

function ReqStatus({
    loading,
    onRetry,
    error,
    btn,
    children,
    length,
    colSpan,
    loadingText = 'Loading...',
    errorText = 'Failed to load data',
    emptyText = 'No data available',
}: ReqStatusProps) {

    const renderContent = (content: React.ReactNode) => {
        if (colSpan) {
            return (
                <TableRow>
                    <TableCell colSpan={colSpan} className="text-center py-12">
                        {content}
                    </TableCell>
                </TableRow>
            )
        }

        return (
            <div className="flex items-center justify-center py-12">
                {content}
            </div>
        )
    }

    if (loading) {
        return renderContent(
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">{loadingText}</p>
            </div>
        )
    }

    if (error) {
        const isOffline = !navigator.onLine;
        return renderContent(
            <Alert variant="destructive" className="flex flex-col items-center gap-3">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription>
                    {isOffline
                        ? "No internet connection. Please check your network."
                        : errorText}
                </AlertDescription>

                {onRetry && (
                    <Button
                        variant="destructive"
                        onClick={onRetry}
                    >
                        Try Again
                    </Button>
                )}

            </Alert>
        );
    }


    if (length === 0) {
        return renderContent(
            <div className="flex flex-col items-center gap-3 text-center">
                <div className="rounded-full bg-muted p-3">
                    <Inbox className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">{emptyText}</p>
                {btn && <div className="mt-4">{btn}</div>}
            </div>
        )
    }

    return <>{children}</>
}
export default ReqStatus