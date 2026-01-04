import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

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
        console.error('OAuth error:', authError);
        // Redirect to home with error message
        navigate('/?error=' + encodeURIComponent('Authentication failed. Please try again.'));
        return;
      }

      // Get tokens from URL
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const expiresIn = searchParams.get('expires_in');

      if (!accessToken || !refreshToken) {
        console.error('Missing tokens in OAuth callback');
        navigate('/?error=' + encodeURIComponent('Authentication failed. Missing credentials.'));
        return;
      }

      try {
        // Store tokens
        const tokens = {
          accessToken,
          refreshToken,
          expiresIn: expiresIn ? parseInt(expiresIn) : 3600
        };
        localStorage.setItem('furnacelog_tokens', JSON.stringify(tokens));

        // Fetch user profile
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/v1/auth/me`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.user) {
            localStorage.setItem('furnacelog_user', JSON.stringify(data.data.user));
          }
        }

        // Redirect to dashboard (home page will show dashboard content when logged in)
        navigate('/', { replace: true });

      } catch (error) {
        console.error('Error processing OAuth callback:', error);
        navigate('/?error=' + encodeURIComponent('Authentication failed. Please try again.'));
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
