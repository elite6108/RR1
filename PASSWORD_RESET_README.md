# Password Reset Functionality

This document explains how to set up and use the password reset functionality that has been added to your application.

## Components Added

1. `ForgotPassword.tsx` - A form where users can enter their email to request a password reset
2. `ResetPassword.tsx` - A form where users can set a new password after clicking the reset link in their email
3. Updated routes in `AppRoutes.tsx` to handle these new pages
4. Added "Forgot your password?" link to the login form

## How It Works

The password reset flow is as follows:

1. User clicks "Forgot your password?" on the login screen
2. User enters their email on the password reset request page
3. Supabase sends a password reset email to the user
4. User clicks the link in the email, which redirects them to your app's `/reset-password` route
5. User sets a new password
6. User is redirected back to the login page to sign in with their new password

## Supabase Configuration

To ensure password reset emails work properly, you need to configure Supabase:

1. **Email Templates**: Log in to your Supabase dashboard at [https://app.supabase.com/](https://app.supabase.com/)
2. Navigate to **Authentication** > **Email Templates**
3. Find the "Reset Password" template and customize it if needed
4. Ensure the **Site URL** is correctly set to your production URL in **Authentication** > **URL Configuration**

### Local Development Setup

For local development, you need to configure Supabase to redirect to your local URL:

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **URL Configuration**
3. Add your local development URL (e.g., `http://localhost:5173`) to the list of redirect URLs

## Testing the Password Reset Functionality

To test the password reset flow:

1. Run your application locally: `npm run dev`
2. Navigate to the login page and click on "Forgot your password?"
3. Enter your email and submit the form
4. Check your email for the password reset link
5. Click the link, which should redirect you to your application's reset password page
6. Enter a new password and submit the form
7. You should be redirected to the login page where you can now log in with your new password

### Testing Notes

- **Development Environment**: In development, Supabase may not send actual emails. Check the Supabase dashboard under **Authentication** > **Users** to find a magic link for testing.
- **Email Delivery**: Ensure your Supabase project is on a paid plan if you want reliable email delivery in production.
- **Rate Limiting**: Supabase has rate limiting for password reset requests to prevent abuse.

## Security Considerations

- Password reset tokens expire after a short period (typically 24 hours)
- Each token can only be used once
- Supabase handles the security aspects of generating and validating reset tokens

## Customization

You can customize the look and feel of the password reset pages by editing:

- `ForgotPassword.tsx` - For the request page UI
- `ResetPassword.tsx` - For the reset page UI
- Supabase email templates - For the email content users receive

## Troubleshooting

If you encounter issues with the password reset flow:

1. **Email not received**: Check your spam folder or the Supabase dashboard for the magic link
2. **Reset link not working**: Ensure your redirect URLs are properly configured in Supabase
3. **Invalid token error**: The token may have expired or been used already; request a new one
4. **API errors**: Check the browser console for error messages and ensure your Supabase configuration is correct

For further assistance, refer to the [Supabase documentation on password resets](https://supabase.com/docs/guides/auth/auth-password-reset).
