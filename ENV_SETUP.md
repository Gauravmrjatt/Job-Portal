# Environment Variables for Vercel Deployment

This Next.js Job Portal requires the following environment variables to be configured in Vercel:

## Required Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/dbname`) |
| `SECRET_KEY` | JWT secret key for authentication |
| `CLOUD_NAME` | Cloudinary cloud name |
| `API_KEY` | Cloudinary API key |
| `API_SECRET` | Cloudinary API secret |

## Setting up in Vercel

1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable listed above with your actual values
4. Redeploy your application
