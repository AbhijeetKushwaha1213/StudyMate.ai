import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AUTH_ERROR_KEYS = ['error', 'error_code', 'error_description'];

const getAuthErrorMessage = () => {
  const url = new URL(window.location.href);

  for (const key of AUTH_ERROR_KEYS) {
    const value = url.searchParams.get(key);
    if (value) {
      return value.replace(/\+/g, ' ');
    }
  }

  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  for (const key of AUTH_ERROR_KEYS) {
    const value = hashParams.get(key);
    if (value) {
      return value.replace(/\+/g, ' ');
    }
  }

  return null;
};

export const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let isActive = true;
    let fallbackTimer: number | undefined;
    const errorMessage = getAuthErrorMessage();

    if (errorMessage) {
      toast({
        title: 'Google Sign In Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      navigate('/auth', { replace: true });
      return;
    }

    const resolveSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!isActive) {
        return;
      }

      if (error) {
        toast({
          title: 'Google Sign In Failed',
          description: error.message,
          variant: 'destructive',
        });
        navigate('/auth', { replace: true });
        return;
      }

      if (data.session) {
        // Check if this was a Google OAuth login
        const isGoogleOAuth = sessionStorage.getItem('google_oauth_initiated') === 'true';
        
        if (isGoogleOAuth) {
          // Check if user profile exists (meaning they signed up before)
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('user_id')
            .eq('user_id', data.session.user.id)
            .single();

          if (profileError || !profile) {
            // New user trying to use Google OAuth - reject them
            console.log('New user attempted Google OAuth - rejecting');
            
            // Sign them out
            await supabase.auth.signOut();
            sessionStorage.removeItem('google_oauth_initiated');
            
            toast({
              title: 'Google Sign In Not Allowed',
              description: 'Please sign up with email and password first. After creating an account, you can link your Google account.',
              variant: 'destructive',
            });
            navigate('/auth', { replace: true });
            return;
          }
        }
        
        // Clear the flag
        sessionStorage.removeItem('google_oauth_initiated');
        navigate('/', { replace: true });
        return;
      }

      fallbackTimer = window.setTimeout(() => {
        if (!isActive) {
          return;
        }

        sessionStorage.removeItem('google_oauth_initiated');
        toast({
          title: 'Google Sign In Incomplete',
          description: 'No session was created after Google redirected back. Check your Supabase Google provider and redirect URL settings.',
          variant: 'destructive',
        });
        navigate('/auth', { replace: true });
      }, 1500);
    };

    resolveSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isActive) {
        return;
      }

      if (event === 'SIGNED_IN' && session) {
        navigate('/', { replace: true });
      }
    });

    return () => {
      isActive = false;
      if (fallbackTimer) {
        window.clearTimeout(fallbackTimer);
      }
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Completing Google sign in...</p>
      </div>
    </div>
  );
};
