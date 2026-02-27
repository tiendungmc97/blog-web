# 🧭 Git Workflow Guidelines

> **Purpose:** To ensure consistent, clean, and reliable collaboration using Git across all developers in the project.

---

## 📋 Table of Contents

1. [Branch Structure](#1️⃣-branch-structure)
2. [Branch Naming Convention](#2️⃣-branch-naming-convention)
3. [Commit Message Rules](#3️⃣-commit-message-rules)
4. [Workflow Steps](#4️⃣-workflow-steps)
5. [Release Process](#5️⃣-release-process)
6. [Hotfix Process](#6️⃣-hotfix-process)
7. [Rebase and Merge Rules](#7️⃣-rebase-and-merge-rules)
8. [Automation & Protection](#8️⃣-automation--protection)
9. [Tagging & Versioning](#9️⃣-tagging--versioning)
10. [Summary](#✅-summary)

---

## 1️⃣ Branch Structure

### 🌳 Branch Types Overview

| Branch Name     | Purpose                      | Created From | Merged Into          | Protection Level        |
| --------------- | ---------------------------- | ------------ | -------------------- | ----------------------- |
| **`main`**      | 🚀 Production-ready code     | N/A          | N/A                  | 🔒 **Highly Protected** |
| **`develop`**   | 🧪 Integration & QA testing  | `main`       | `main` (via release) | 🔒 **Protected**        |
| **`feature/*`** | ⚡ Individual features/tasks | `develop`    | `develop`            | ✅ Standard             |
| **`release/*`** | 📦 Version preparation       | `develop`    | `main` + `develop`   | 🔒 **Protected**        |
| **`hotfix/*`**  | 🚨 Urgent production fixes   | `main`       | `main` + `develop`   | ⚠️ **Emergency Only**   |

### 🔐 Branch Protection Rules

- **`main`**: Only merge from `release/*` or `hotfix/*` branches
- **`develop`**: Only merge approved feature branches via PR
- **Feature branches**: Must pass CI/CD and code review before merge

---

## 2️⃣ Branch Naming Convention

### 📏 Naming Structure

```bash
<type>/<ticket-id>-<short-description>
```

### 🏷️ Branch Types & Examples

| Type        | Format                  | Example                             | Usage               |
| ----------- | ----------------------- | ----------------------------------- | ------------------- |
| **Feature** | `feature/<id>-<desc>`   | `feature/FE-102-add-login-api`      | New functionality   |
| **Hotfix**  | `hotfix/<issue>-<desc>` | `hotfix/URGENT-fix-payment-timeout` | Critical fixes      |
| **Release** | `release/v<version>`    | `release/v1.3.0`                    | Version preparation |
| **Bugfix**  | `bugfix/<id>-<desc>`    | `bugfix/BF-45-fix-validation`       | Non-critical fixes  |

> 💡 **Tip:** Keep descriptions short (2-4 words max) and use kebab-case

---

## 3️⃣ Commit Message Rules

### 📝 Conventional Commits Format

```bash
<type>(<scope>): <short summary>

[optional body]

[optional footer(s)]
```

### 🏷️ Commit Types

| Type           | Icon | Purpose          | Example                                          |
| -------------- | ---- | ---------------- | ------------------------------------------------ |
| **`feat`**     | ✨   | New feature      | `feat(auth): add Google OAuth integration`       |
| **`fix`**      | 🐛   | Bug fix          | `fix(ui): prevent form flicker on page load`     |
| **`refactor`** | ♻️   | Code improvement | `refactor(utils): simplify date formatter logic` |
| **`docs`**     | 📚   | Documentation    | `docs(readme): update installation guide`        |
| **`style`**    | 💄   | Formatting, UI   | `style(button): update primary button colors`    |
| **`test`**     | ✅   | Testing          | `test(auth): add unit tests for login flow`      |
| **`chore`**    | 🔧   | Build/config     | `chore(deps): update React to v18.2.0`           |
| **`perf`**     | ⚡   | Performance      | `perf(api): optimize database queries`           |

### ✅ Good Commit Examples

```bash
feat(payment): integrate Stripe payment gateway
fix(validation): resolve email regex pattern issue
refactor(components): extract reusable Button component
docs(api): add endpoint documentation for user management
```

---

## 4️⃣ Workflow Steps

### 🚀 4.1 Creating a Feature Branch

#### Step-by-Step Process

```bash
# 1️⃣ Switch to develop and get latest changes
git checkout develop
git pull origin develop

# 2️⃣ Create and switch to new feature branch
git checkout -b feature/FE-102-add-login-api

# 3️⃣ Verify you're on the correct branch
git branch --show-current
```

#### 💻 Development Workflow

```bash
# Make your changes...
# Then commit frequently with meaningful messages
git add .
git commit -m "feat(auth): add Google OAuth integration"

# Continue development...
git add src/components/LoginForm.tsx
git commit -m "feat(auth): create login form component"
```

> ⭐ **Best Practice:** Commit small, logical changes frequently rather than large, complex commits.

---

### 🔄 4.2 Keeping Your Branch Updated

#### Before Pushing or Opening PR

```bash
# 1️⃣ Fetch latest changes from remote
git fetch origin

# 2️⃣ Rebase your branch onto latest develop
git rebase origin/develop
```

#### 🚨 Important Rules

| Scenario              | Action              | Command                     | Reason                         |
| --------------------- | ------------------- | --------------------------- | ------------------------------ |
| **Local branch only** | ✅ Use rebase       | `git rebase origin/develop` | Clean linear history           |
| **Already pushed**    | ⚠️ Use merge        | `git merge origin/develop`  | Avoid rewriting shared history |
| **Conflicts exist**   | 🔧 Resolve manually | `git rebase --continue`     | After fixing conflicts         |

> ⚠️ **Warning:** Never rebase branches that have been pushed and shared with others!

---

### 📤 4.3 Push and Create Pull Request

#### Push Your Branch

```bash
# Push feature branch to remote
git push origin feature/FE-102-add-login-api

# If branch was rebased locally, force push carefully
git push --force-with-lease origin feature/FE-102-add-login-api
```

#### 📋 PR Checklist

Before creating your Pull Request, ensure:

- [ ] ✅ **CI Pipeline passes** - All tests and lints are green
- [ ] 🔍 **Self-review completed** - Check your own changes first
- [ ] 📝 **Clear PR description** - Explain what and why
- [ ] 🏷️ **Proper labels** - Add relevant tags (feature, bugfix, etc.)
- [ ] 👥 **Reviewers assigned** - Tag appropriate team members
- [ ] 📊 **Test coverage** - Meets project requirements

#### 📝 PR Template

```markdown
## 🎯 What does this PR do?

Brief description of the changes...

## 🔧 Type of Change

- [ ] 🆕 New feature
- [ ] 🐛 Bug fix
- [ ] ♻️ Refactoring
- [ ] 📚 Documentation
- [ ] 🎨 Style/UI changes

## ✅ Testing

- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## 📷 Screenshots (if applicable)

Add screenshots for UI changes...
```

---

### 🎯 4.4 Merging Strategy

#### Merge Types & When to Use

| Merge Type         | When to Use      | Command   | Result                   |
| ------------------ | ---------------- | --------- | ------------------------ |
| **Squash & Merge** | Feature branches | GitHub UI | Clean single commit      |
| **Merge Commit**   | Release/Hotfix   | GitHub UI | Preserves branch history |
| **Rebase & Merge** | Small, clean PRs | GitHub UI | Linear history           |

#### Post-Merge Cleanup

```bash
# 1️⃣ Switch back to develop
git checkout develop

# 2️⃣ Pull latest changes (includes your merged PR)
git pull origin develop

# 3️⃣ Delete local feature branch
git branch -d feature/FE-102-add-login-api

# 4️⃣ Delete remote feature branch (if not auto-deleted)
git push origin --delete feature/FE-102-add-login-api
```

> 💡 **Tip:** Enable "Automatically delete head branches" in GitHub settings to auto-cleanup merged branches.

---

## 5️⃣ Release Process

### 🚀 Creating a Release

#### Step 1: Create Release Branch

```bash
# 1️⃣ Start from latest develop
git checkout develop
git pull origin develop

# 2️⃣ Create release branch
git checkout -b release/v1.3.0
```

#### Step 2: Finalize Release

```bash
# 🧪 Perform final testing
npm run test:all
npm run build
npm run e2e

# 🐛 Fix any last-minute issues
git add .
git commit -m "fix(release): resolve pre-release issues"
```

#### Step 3: Merge to Production

```bash
# 1️⃣ Merge to main
git checkout main
git pull origin main
git merge release/v1.3.0

# 2️⃣ Create version tag
git tag -a v1.3.0 -m "Release v1.3.0: Add user authentication"

# 3️⃣ Push main and tags
git push origin main
git push origin --tags

# 4️⃣ Merge back to develop
git checkout develop
git merge release/v1.3.0
git push origin develop

# 5️⃣ Clean up release branch
git branch -d release/v1.3.0
git push origin --delete release/v1.3.0
```

### 📋 Release Checklist

- [ ] 🧪 **All tests pass** - Unit, integration, and e2e tests
- [ ] 📝 **Changelog updated** - Document new features and fixes
- [ ] 🔢 **Version bumped** - Update package.json version
- [ ] 🏷️ **Release notes** - Prepare GitHub release notes
- [ ] 🚀 **Deployment ready** - CI/CD pipeline configured

---

## 6️⃣ Hotfix Process

### 🚨 Emergency Fix Workflow

#### Step 1: Create Hotfix Branch

```bash
# 1️⃣ Start from production (main)
git checkout main
git pull origin main

# 2️⃣ Create hotfix branch
git checkout -b hotfix/URGENT-fix-payment-crash
```

#### Step 2: Implement Fix

```bash
# 🔧 Make the critical fix
git add .
git commit -m "fix(payment): resolve null pointer in payment gateway"

# 🧪 Test the fix thoroughly
npm run test
npm run build
```

#### Step 3: Deploy Hotfix

```bash
# 1️⃣ Merge to main (production)
git checkout main
git merge hotfix/URGENT-fix-payment-crash

# 2️⃣ Create patch version tag
git tag -a v1.3.1 -m "Hotfix v1.3.1: Fix payment gateway crash"

# 3️⃣ Push to production
git push origin main
git push origin --tags

# 4️⃣ Merge back to develop
git checkout develop
git pull origin develop
git merge hotfix/URGENT-fix-payment-crash
git push origin develop

# 5️⃣ Clean up hotfix branch
git branch -d hotfix/URGENT-fix-payment-crash
git push origin --delete hotfix/URGENT-fix-payment-crash
```

### ⚡ Hotfix Guidelines

- **🎯 Purpose**: Critical production bugs only
- **⏱️ Timeline**: Should be completed within hours, not days
- **🧪 Testing**: Minimal but thorough testing required
- **📢 Communication**: Notify team immediately when hotfix is needed
- **📝 Documentation**: Update changelog and incident reports

---

## 7️⃣ Rebase and Merge Rules

### 🔄 When to Use Each Strategy

| Strategy      | When to Use            | Command                     | Benefits                                     | Risks                                          |
| ------------- | ---------------------- | --------------------------- | -------------------------------------------- | ---------------------------------------------- |
| **🔄 Rebase** | Local branches only    | `git rebase origin/develop` | ✅ Clean linear history<br>✅ Easy to follow | ⚠️ Rewrites history<br>⚠️ Can cause conflicts  |
| **🔀 Merge**  | Shared branches        | `git merge origin/develop`  | ✅ Preserves history<br>✅ Safe for teams    | ❌ Creates merge commits<br>❌ Complex history |
| **🚫 Don't**  | Rebase shared branches | ❌ **Never do this**        | N/A                                          | 🚨 Breaks team workflow                        |

### 🎯 Best Practices

- **✅ DO**: Rebase your local feature branch before creating PR
- **✅ DO**: Use merge commits for important milestones (releases)
- **❌ DON'T**: Rebase branches that others are working on
- **❌ DON'T**: Force push shared branches without `--force-with-lease`

### 🔧 Conflict Resolution

```bash
# If conflicts occur during rebase
git rebase origin/develop

# Fix conflicts in your editor, then:
git add .
git rebase --continue

# Or abort if needed
git rebase --abort
```

---

## 8️⃣ Automation & Protection

### 🔒 Branch Protection Settings

#### Required for `main` and `develop` branches:

- [ ] **🛡️ Require pull request reviews before merging**
  - Minimum 1 approving review
  - Dismiss stale reviews when new commits are pushed
  - Require review from code owners

- [ ] **✅ Require status checks to pass before merging**
  - Require branches to be up to date before merging
  - Include CI/CD pipeline checks

- [ ] **🚫 Restrict pushes that create files**
  - Disallow direct pushes to protected branches
  - Include administrators in restrictions

### 🤖 Automated Quality Checks

#### Pre-commit Hooks Setup

```bash
# Install Husky for Git hooks
npm install --save-dev husky

# Initialize Husky
npx husky install

# Add pre-commit hook for linting
npx husky add .husky/pre-commit "npm run lint:fix && npm run test:changed"

# Add commit-msg hook for conventional commits
npx husky add .husky/commit-msg "npx commitlint --edit $1"
```

#### Lint-Staged Configuration

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,scss,md}": ["prettier --write"]
  }
}
```

### 🔧 CI/CD Pipeline Requirements

- **🧪 Testing**: All tests must pass (unit, integration, e2e)
- **🎨 Linting**: Code style and quality checks
- **📊 Coverage**: Maintain minimum test coverage threshold
- **🔍 Security**: Dependency vulnerability scanning
- **📦 Build**: Successful build for target environments

---

## 9️⃣ Tagging & Versioning

### 📋 Semantic Versioning (SemVer)

Follow the **MAJOR.MINOR.PATCH** format:

```
v1.2.3
│ │ │
│ │ └── PATCH: Bug fixes, hotfixes
│ └──── MINOR: New features, backward compatible
└────── MAJOR: Breaking changes, API changes
```

### 🏷️ Version Examples & When to Use

| Version Change | Example             | When to Use                                                                            |
| -------------- | ------------------- | -------------------------------------------------------------------------------------- |
| **🚀 MAJOR**   | `v1.0.0` → `v2.0.0` | • Breaking API changes<br>• Remove deprecated features<br>• Major architecture changes |
| **✨ MINOR**   | `v1.1.0` → `v1.2.0` | • New features<br>• Add new API endpoints<br>• Backward-compatible changes             |
| **🐛 PATCH**   | `v1.1.1` → `v1.1.2` | • Bug fixes<br>• Security patches<br>• Performance improvements                        |

### 🏷️ Pre-release Versions

```bash
v1.2.0-alpha.1    # Early development
v1.2.0-beta.2     # Feature complete, testing
v1.2.0-rc.1       # Release candidate
```

### 📝 Tagging Best Practices

#### Creating Tags

```bash
# Create annotated tag with message
git tag -a v1.2.0 -m "Release v1.2.0: Add user dashboard"

# Push tags to remote
git push origin --tags

# Tag specific commit
git tag -a v1.2.0 <commit-hash> -m "Release v1.2.0"
```

#### Tag Message Format

```bash
# Good tag messages
git tag -a v1.2.0 -m "Release v1.2.0: Add user authentication and dashboard"
git tag -a v1.2.1 -m "Hotfix v1.2.1: Fix login validation bug"

# Include key changes
git tag -a v2.0.0 -m "Release v2.0.0:
- BREAKING: New API authentication
- Add GraphQL endpoints
- Remove deprecated REST endpoints"
```

---

## ✅ Quick Reference Summary

### 🎯 Golden Rules

| Rule                    | Description                         | Why Important                                   |
| ----------------------- | ----------------------------------- | ----------------------------------------------- |
| **🌿 Branch-based**     | Always work on feature branches     | Isolates changes, enables parallel development  |
| **⏱️ Short-lived**      | Keep feature branches under 1 week  | Reduces merge conflicts, faster integration     |
| **🔄 Rebase locally**   | Rebase before pushing/PR            | Clean linear history, easier to follow          |
| **🔀 Merge publicly**   | Use merge for shared branches       | Preserves team collaboration history            |
| **👥 Always PR**        | No direct pushes to main/develop    | Code review, quality control, knowledge sharing |
| **🏷️ Tag releases**     | Every production release gets a tag | Version tracking, rollback capability           |
| **🔒 Protect branches** | Branch protection on main/develop   | Prevents accidental direct commits              |

### ⚡ Quick Commands Reference

```bash
# 🚀 Start new feature
git checkout develop && git pull origin develop
git checkout -b feature/TICKET-123-feature-name

# 🔄 Update feature branch
git fetch origin && git rebase origin/develop

# 📤 Push and create PR
git push origin feature/TICKET-123-feature-name

# 🎯 Release workflow
git checkout -b release/v1.2.0
# ... testing and fixes ...
git checkout main && git merge release/v1.2.0
git tag -a v1.2.0 -m "Release v1.2.0"

# 🚨 Hotfix workflow
git checkout main && git checkout -b hotfix/urgent-fix
# ... fix and test ...
git checkout main && git merge hotfix/urgent-fix
git tag -a v1.2.1 -m "Hotfix v1.2.1"
```

### 📚 Additional Resources

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Semantic Versioning Guide](https://semver.org/)
- [Git Flow Cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/)
- [GitHub Flow Documentation](https://docs.github.com/en/get-started/quickstart/github-flow)

---

> 🎉 **Remember**: Good Git workflow is about team collaboration, not just technical process. Communicate, review code, and help each other grow!
