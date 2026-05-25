# Chinese Dragon Restaurant Web Application

## Docs

- ER Diagram, Use Case Diagram, and SRS PDF are in /docs

## Tech Stack

- MongoDB, Express.js, React.js, Node.js

## Features

- User Authentication
- Menu Management
- Order System
- Review System
- Contact System

## Email setup with Brevo

Use Brevo's transactional email API for password-reset and transactional emails from the backend.

1. Create a Brevo account and verify a sender email or sender domain.
2. In Brevo, go to SMTP and API and create/copy your API key.
3. Set these backend environment variables on Render:
   - `BREVO_API_KEY=your_brevo_api_key`
   - `EMAIL_FROM="Your Restaurant <verified-sender@yourdomain.com>"`
   - `FRONTEND_URL=https://your-frontend.vercel.app`
4. Remove the old Gmail-specific variables from Render: `EMAIL` and `EMAIL_PASSWORD`.
5. `CLIENT_URL` can stay for compatibility, but `FRONTEND_URL` is the preferred value now.
6. Redeploy the backend on Render.
7. Test the flow by requesting a password reset and confirming the email arrives.
