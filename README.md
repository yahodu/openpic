# OpenPic Web Application

Web application for OpenPic powered by Nextjs. This is a monorepo which contains:
1. OpenPic Homepage
2. OpenPic Web Frontend
3. OpenPic Backend

## Development

### Code Commit

1. `.gitmessage` contains the git commit message template structure.
2. You can setup the commit message template: `git config commit.template .gitmessage`
3. After adding the files to stage, commit the files using: `git commit`
> Do not commit using `git commit -m ""`. This would bypass the commit message template.

### Environment Variables

| Variable | Description | Required | Visibility |
| :--- | :--- | :---: | :---: |
| `MONGODB_URI` | MongoDB connection string | ✅ | Backend |
| `UPSTASH_REDIS_PHOTO_REST_URL` | Upstash REST API URL for Photo data | ✅ | Backend |
| `UPSTASH_REDIS_PHOTO_REST_TOKEN` | Upstash REST API Token for Photo data | ✅ | Backend |
| `UPSTASH_REDIS_SELFIE_REST_URL` | Upstash REST API URL for Selfie data | ✅ | Backend |
| `UPSTASH_REDIS_SELFIE_REST_TOKEN` | Upstash REST API Token for Selfie data | ✅ | Backend |
| `STORJ_ENDPOINT` | Storj S3-compatible endpoint URL | ✅ | Backend |
| `STORJ_ACCESS_KEY` | Storj Access Key ID | ✅ | Backend |
| `STORJ_SECRET_KEY` | Storj Secret Access Key | ✅ | Backend |
| `STORJ_BUCKET_NAME` | Name of the Storj bucket | ✅ | Backend |
| `STORJ_PUBLIC_GATEWAY` | Public gateway URL for accessing files | ✅ | Frontend/Backend |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | ✅ | Frontend/Backend |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | ✅ | Backend |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | ✅ | Backend |
| `CLOUDINARY_FOLDER` | Default folder path for uploads | ✅ | Backend |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | EmailJS Public Key | ✅ | Frontend/Backend |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | EmailJS Service ID | ✅ | Frontend/Backend |
| `NEXT_PUBLIC_EMAILJS_CONTACT_US_TEMPLATE_ID` | Template ID for contact form | ✅ | Frontend/Backend |
| `NEXT_PUBLIC_EMAILJS_AUTO_REPLY_TEMPLATE_ID` | Template ID for auto-replies | ✅ | Frontend/Backend |
