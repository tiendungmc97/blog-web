module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Ensure the commit message has a type - synced with git-workflow-guidelines.md
    "type-enum": [
      2,
      "always",
      [
        "feat", // ✨ New feature
        "fix", // 🐛 Bug fix
        "refactor", // ♻️ Code improvement
        "docs", // 📚 Documentation
        "style", // 💄 Formatting, UI
        "test", // ✅ Testing
        "chore", // 🔧 Build/config
        "perf", // ⚡ Performance
      ],
    ],
    // Ensure subject is not empty
    "subject-empty": [2, "never"],
    // Ensure subject is not too long
    "subject-max-length": [2, "always", 72],
    // Ensure subject doesn't end with a period
    "subject-full-stop": [2, "never", "."],
    // Ensure subject is lowercase
    "subject-case": [2, "always", "lower-case"],
    // Ensure header is not too long
    "header-max-length": [2, "always", 100],
    // Ensure body has blank line after header
    "body-leading-blank": [2, "always"],
    // Ensure footer has blank line after body
    "footer-leading-blank": [2, "always"],
  },
};
