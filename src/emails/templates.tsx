
export const getWelcomeEmailTemplate = (name: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Flux</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f7; margin: 0; padding: 0; color: #1d1d1f; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .header { background: #000000; padding: 40px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-weight: 600; font-size: 24px; letter-spacing: -0.5px; }
        .content { padding: 40px; }
        .greeting { font-size: 20px; font-weight: 600; margin-bottom: 20px; }
        .text { line-height: 1.6; color: #333; font-size: 16px; margin-bottom: 30px; }
        .button-container { text-align: center; margin: 40px 0; }
        .button { background-color: #0071e3; color: #ffffff; padding: 12px 24px; border-radius: 980px; text-decoration: none; font-weight: 500; font-size: 16px; transition: background-color 0.2s; display: inline-block; }
        .button:hover { background-color: #0077ed; }
        .footer { background-color: #f5f5f7; padding: 30px; text-align: center; font-size: 12px; color: #86868b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Flux</h1>
        </div>
        <div class="content">
            <div class="greeting">Hello ${name},</div>
            <p class="text">Welcome to Flux. You've just unlocked a new way to organize your thoughts, tasks, and time. We've designed Flux to get out of your way so you can focus on what matters most.</p>
            <div class="button-container">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/ideation" class="button">Get Started</a>
            </div>
            <p class="text">If you have any questions, simply reply to this email. We're here to help.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Flux Inc. All rights reserved.</p>
            <p>San Francisco, CA</p>
        </div>
    </div>
</body>
</html>
`;
