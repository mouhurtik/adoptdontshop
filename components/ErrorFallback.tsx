'use client';

import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PrimaryButton from './ui/PrimaryButton';

interface ErrorFallbackProps {
  error: Error | null;
  resetError: () => void;
}

const ErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  const router = useRouter();

  const handleGoHome = () => {
    resetError();
    router.push('/');
  };

  const handleRetry = () => {
    resetError();
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-playful-coral/10 via-playful-mint/10 to-playful-lavender/10 p-4">
      <div className="max-w-2xl w-full bg-white rounded-[2rem] p-8 md:p-12 shadow-soft border-4 border-playful-yellow/20 text-center">
        <div className="bg-playful-coral/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-12 h-12 text-playful-coral" />
        </div>

        <h1 className="text-4xl font-heading font-black text-playful-text mb-4">
          Oops! Something went wrong
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          We encountered an unexpected error. Don&apos;t worry, our team has been notified and we&apos;re working on it!
        </p>

        {error && process.env.NODE_ENV === 'development' && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8 text-left">
            <p className="font-bold text-red-800 mb-2">Error Details (Development Only):</p>
            <p className="text-sm text-red-700 font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <PrimaryButton
            onClick={handleRetry}
            variant="primary"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </PrimaryButton>

          <PrimaryButton
            onClick={handleGoHome}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go Home
          </PrimaryButton>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          If this problem persists, please contact us at{' '}
          <a href="mailto:support@adoptdontshop.com" className="text-playful-teal hover:underline font-bold">
            support@adoptdontshop.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default ErrorFallback;
