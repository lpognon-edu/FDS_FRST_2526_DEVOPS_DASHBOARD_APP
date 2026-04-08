# Deployment Guide

## Automated Deployment Pipeline

This project uses **semantic-release** to automate version management and artifact creation.

### How It Works

1. **Push commits** to `develop` or `main` branch
2. **CI/CD pipeline** runs tests and builds
3. **Semantic-release analyzes** commit messages (using Conventional Commits)
4. **Version is bumped** automatically (MAJOR.MINOR.PATCH)
5. **Artifact is created** and uploaded to GitHub Releases
6. **Tar.gz archive** is stored in `dist/` folder

### Commit Message Convention

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type(scope): description

[optional body]
[optional footer]
```

#### Types

- **feat**: New feature → **MINOR** version bump
- **fix**: Bug fix → **PATCH** version bump
- **BREAKING CHANGE**: Breaking API change → **MAJOR** version bump
- **docs**: Documentation changes (no version bump)
- **style**: Code style changes (no version bump)
- **refactor**: Code refactoring (no version bump)
- **test**: Test changes (no version bump)
- **ci**: CI/CD changes (no version bump)

#### Examples

```bash
# Bug fix → v1.0.1
git commit -m "fix: resolve port conflict in test suites"

# New feature → v1.1.0
git commit -m "feat(api): add incidents filtering endpoint"

# Breaking change → v2.0.0
git commit -m "feat(api): change API response format

BREAKING CHANGE: Response format changed from array to object"
```

### Branches

- **main**: Production releases
  - Automatic version tags: `v1.0.0`, `v1.0.1`, `v1.1.0`, etc.
  - Artifacts uploaded to GitHub Releases

- **develop**: Pre-release versions
  - Automatic version tags: `v1.0.0-pre.1`, `v1.0.0-pre.2`, etc.
  - Marked as pre-release on GitHub

### Getting Artifacts

#### From GitHub Releases
1. Go to [Releases page](../../releases)
2. Download `devops-dashboard-vX.Y.Z.tar.gz`
3. Extract: `tar -xzf devops-dashboard-vX.Y.Z.tar.gz`

#### From Local dist/ Folder
```bash
ls -la dist/
```

### Manual Release (if needed)

Run locally:
```bash
npx semantic-release
```

Requires:
- `GITHUB_TOKEN` environment variable
- Commit history with conventional commit messages

### Verifying Artifacts

```bash
# List all artifacts
ls -lh dist/

# Extract and test
tar -xzf dist/devops-dashboard-v1.0.0.tar.gz
cd devops-dashboard-v1.0.0
npm install
npm start
```

### GitHub Release Assets

Each GitHub Release includes:
- `.tar.gz` artifact with full source
- Release notes (auto-generated from commits)
- Source code ZIP (GitHub default)

### Troubleshooting

**Issue**: No artifacts created
- ✅ Ensure commits follow Conventional Commits format
- ✅ Push to `main` or `develop` branch
- ✅ Check GitHub Actions workflow logs

**Issue**: Version not bumped
- ✅ Use `feat:`, `fix:`, or `BREAKING CHANGE:` prefixes
- ✅ Run `git log --oneline` to verify commit messages

**Issue**: NPM token issue
- ✅ This project doesn't publish to npm registry (disabled in `.npmignore`)
- ✅ Only GitHub Releases are used for distribution
