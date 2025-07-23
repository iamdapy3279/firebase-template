# Deployment Guide

This guide covers deploying your Firebase Template application to production.

## Prerequisites

- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project created
- GitHub repository set up (for CI/CD)

## Manual Deployment

### 1. Build the Application
```bash
npm run build
```

### 2. Deploy to Firebase Hosting
```bash
firebase deploy
```

### 3. Deploy Security Rules
```bash
firebase deploy --only firestore:rules,storage
```

## Automated Deployment with GitHub Actions

### 1. Set up Repository Secrets

In your GitHub repository, go to Settings > Secrets and variables > Actions, and add:

**Firebase Configuration:**
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

**Firebase Service Account:**
- `FIREBASE_SERVICE_ACCOUNT` (JSON from Firebase project settings)
- `FIREBASE_PROJECT_ID`

### 2. Generate Firebase Service Account

1. Go to Firebase Console > Project Settings
2. Click on "Service accounts" tab
3. Click "Generate new private key"
4. Copy the entire JSON content to `FIREBASE_SERVICE_ACCOUNT` secret

### 3. Automatic Deployment

The GitHub Actions workflow will automatically:
- Run tests and linting
- Build the application
- Deploy to Firebase Hosting
- Deploy security rules

Deployments trigger on:
- Push to `main` branch
- Pull requests to `main` branch (preview deployment)

## Environment Setup

### Development
```bash
cp .env.example .env
# Fill in your development Firebase config
npm run dev
```

### Production
Environment variables are automatically injected during GitHub Actions deployment.

## Custom Domain Setup

1. In Firebase Console, go to Hosting
2. Click "Add custom domain"
3. Enter your domain name
4. Follow DNS configuration instructions
5. Wait for SSL certificate provisioning

## Monitoring and Analytics

### Firebase Analytics
Enable Google Analytics in your Firebase project for user insights.

### Performance Monitoring
```bash
firebase deploy --only hosting,functions
```

### Error Reporting
Errors are automatically reported to Firebase Crashlytics.

## Rollback Strategy

### Quick Rollback
```bash
firebase hosting:rollback
```

### Specific Version Rollback
```bash
firebase hosting:rollback --version <version-id>
```

## Troubleshooting

### Build Failures
- Check environment variables
- Verify Firebase configuration
- Review build logs in GitHub Actions

### Deployment Issues
- Ensure Firebase CLI is up to date
- Check Firebase quotas and billing
- Verify service account permissions

### DNS Issues
- Allow 24-48 hours for DNS propagation
- Use online DNS checkers to verify setup
- Check domain registrar settings

## Security Checklist

- [ ] Environment variables are properly configured
- [ ] Firebase security rules are deployed
- [ ] Custom domain has SSL certificate
- [ ] Authentication is properly configured
- [ ] File uploads are restricted to authenticated users
- [ ] Database access is user-scoped

## Performance Optimization

### Build Optimization
```bash
npm run build -- --analyze
```

### CDN Configuration
Firebase Hosting automatically provides global CDN.

### Caching Strategy
- Static assets: 1 year cache
- Dynamic content: No cache
- API responses: Custom cache headers

## Backup Strategy

### Database Backup
Set up automated Firestore exports in Firebase Console.

### Storage Backup
Configure Google Cloud Storage backup policies.

### Code Backup
Ensure code is backed up in multiple Git repositories.