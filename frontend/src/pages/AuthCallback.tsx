import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { validateRedirectUrl, createErrorRedirect } from '../utils/redirect';
import logger from '../utils/logger';

/**
 * OAuth Callback Page
 * Handles OAuth redirects from Google/Facebook
 * Processes tokens and redirects to dashboard
 */

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const processOAuthCallback = async () => {
      // Check for error
      const authError = searchParams.get('auth_error');
      if (authError) {
        logger.error('OAuth error:', authError);
        // SECURITY: Validate redirect before navigating
        const safeRedirect = createErrorRedirect('/', 'Authentication failed. Please try again.');
        navigate(safeRedirect, { replace: true });
        return;
      }

      // SECURITY FIX: No tokens in URL - they're in httpOnly cookies
      // Just verify authentication by calling the backend
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/v1/auth/me`, {
          credentials: 'include' // IMPORTANT: Send httpOnly cookies
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.user) {
            // User is authenticated via httpOnly cookies
            // SECURITY: Validate redirect parameter if present
            const redirectTo = searchParams.get('redirect');
            const safeRedirect = redirectTo ? validateRedirectUrl(redirectTo) : '/';

            logger.info('OAuth authentication successful', {
              redirectTo: safeRedirect
            });

            // Force full page reload to re-initialize AuthContext with new user state
            window.location.href = safeRedirect;
            return;
          }
        }

        // If response not ok or missing user data
        const safeRedirect = createErrorRedirect('/', 'Authentication failed. Please try again.');
        navigate(safeRedirect, { replace: true });

      } catch (error) {
        logger.error('OAuth callback error', error, { step: 'user_verification' });
        const safeRedirect = createErrorRedirect('/', 'Authentication failed. Please try again.');
        navigate(safeRedirect, { replace: true });
      }
    };

    processOAuthCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-amber-700 animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-stone-50 mb-2">
          Completing sign in...
        </h2>
        <p className="text-stone-400">
          Please wait while we verify your credentials.
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
