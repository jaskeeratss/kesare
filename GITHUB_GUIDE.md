# KESARE Piano Studio — GitHub Repository Guide

Welcome to the **KESARE Piano Studio** version control and deployment guide. This repository is hosted on GitHub at [`https://github.com/jaskeeratss/kesare`](https://github.com/jaskeeratss/kesare).

This guide explains how to manage your code, collaborate, commit updates, push to GitHub, and deploy to free static hosting (such as Cloudflare Pages or GitHub Pages).

---

## 1. Quick Reference Commands

| Action | Command | Purpose |
| :--- | :--- | :--- |
| **Check repository status** | `git status` | View modified, staged, or untracked files |
| **View commit history** | `git log --oneline -n 10` | See recent commit logs with hashes |
| **Pull latest changes** | `git pull origin main` | Fetch and merge changes from GitHub |
| **Stage changes** | `git add .` | Stage all modified and new files |
| **Commit staged changes** | `git commit -m "feat/fix: description"` | Save snapshot with Conventional Commit message |
| **Push to GitHub** | `git push origin main` | Upload your local commits to GitHub |
| **Open repo in browser** | `gh repo view --web` | Instantly launch repository page in browser |

---

## 2. Standard Daily Workflow

When making changes to KESARE Piano Studio (e.g. adding new instruments, fixing styles, expanding repertoire):

### Step 1: Check your current status
Before making or committing changes, verify your branch and working tree:
```bash
git status
```

### Step 2: Stage your modifications
Stage all modified files, or specify individual files:
```bash
# Stage all changes
git add .

# Or stage specific files
git add js/audio.js js/instruments.js
```

### Step 3: Create a clean, descriptive commit
Write clear commit messages using the Conventional Commits format:
```bash
# Adding a new feature
git commit -m "feat(audio): add new vibraphone dampening control"

# Fixing a bug
git commit -m "fix(keyboard): prevent key sticking on mobile scroll"

# Updating documentation or configs
git commit -m "docs: update keyboard shortcut mapping table"
```

### Step 4: Push your commits to GitHub
Push your local commits directly to the `main` branch on GitHub:
```bash
git push origin main
```

---

## 3. Pulling Updates from GitHub

If you make edits directly on GitHub or collaborate from another computer:
```bash
# Fetch and merge updates from the remote repository
git pull origin main
```

---

## 4. Managing GitHub with GitHub CLI (`gh`)

You have GitHub CLI authenticated on your system. Helpful shortcuts:

```bash
# Open repository on GitHub in your default browser
gh repo view --web

# View repository metadata and description in terminal
gh repo view

# View recent GitHub actions or deployment workflows
gh run list

# Check authenticated user details
gh api user --jq '{login: .login, name: .name, html_url: .html_url}'
```

---

## 5. Free Cloud Hosting Deployment

KESARE Piano Studio is built with 100% pure vanilla client-side web technologies (HTML5, CSS3, ES6+ JS, Web Audio API). It requires no build step, no Node.js runtime, and no paid hosting.

### Option A: Cloudflare Pages (Recommended — Fast & Free)
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages**.
2. Click **Create Application** > **Pages** > **Connect to Git**.
3. Select your GitHub repository: `jaskeeratss/kesare`.
4. Configure Build Settings:
   - **Framework preset**: `None`
   - **Build command**: *(leave empty)*
   - **Build output directory**: `/` (root directory)
5. Click **Save and Deploy**.
6. Cloudflare will automatically build, deploy, and assign a free global edge SSL domain (e.g. `kesare.pages.dev`). Any future `git push origin main` will automatically trigger an instant production deployment.

### Option B: GitHub Pages (Alternative)
1. Navigate to [`https://github.com/jaskeeratss/kesare/settings/pages`](https://github.com/jaskeeratss/kesare/settings/pages).
2. Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
3. Under **Branch**, select `main` and folder `/ (root)`.
4. Click **Save**.
5. Your live site will be published at `https://jaskeeratss.github.io/kesare/`.

---

## 6. Best Practices for Version Control

1. **Keep Working Directory Clean**: Commit logical units of work rather than massive unsorted diffs.
2. **Never Force-Push**: Avoid `git push --force` on `main` to protect history integrity.
3. **Protect Secrets & Cache**: The `.gitignore` is pre-configured to exclude `.DS_Store`, environment variables (`.env`), build directories, and temporary files.
4. **Test Before Committing**: Run a quick local HTTP server (`python3 -m http.server 8080` or `npx serve`) and verify audio context initialization and keyboard bindings before pushing.
