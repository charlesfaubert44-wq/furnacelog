import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorStateProps {
  title?: string;
  message?: string;
  retry?: () => void;
  fullPage?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error loading this content. Please try again.',
  retry,
  fullPage = false,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-flame-red-100">
        <AlertTriangle className="h-8 w-8 text-flame-red-600" />
      </div>
      <div className="text-center">
        <h3 className="text-h3 font-heading mb-2">{title}</h3>
        <p className="text-aluminum-600 max-w-md">{message}</p>
      </div>
      {retry && (
        <Button onClick={retry} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

// Inline error alert for forms and sections
export const ErrorAlert: React.FC<{ error: string | null }> = ({ error }) => {
  if (!error) return null;

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};
