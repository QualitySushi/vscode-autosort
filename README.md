
# AutoSort — Automatic Workspace File Organizer

Effortlessly keep your workspace clean and structured.  
**AutoSort** automatically organizes files the moment they appear, using simple rule-based patterns defined in `autosort.json` or your VS Code settings.

Perfect for developers who constantly generate logs, downloads, test files, screenshots, or temporary project work — let AutoSort clean as you build.

---

## ✨ Features

- **Automatic file sorting** based on filename patterns or glob rules  
- **Works instantly** when files are created or renamed  
- **Simple rule format:** patterns → destination folder  
- **Zero configuration needed** — optional `autosort.json`  
- **Respects workspace folders** and relative paths  
- **Lightweight and fast** — uses native VS Code file watchers  
- Works with **any language**, **any project structure**

---

## 🚀 Quick Start

### **1. Create `autosort.json` in your workspace root**

```json
[
  {
    "name": "Images",
    "patterns": ["*.png", "*.jpg", "*.jpeg"],
    "destination": "assets/images"
  },
  {
    "name": "Logs",
    "patterns": ["*.log", "log-*.txt"],
    "destination": "logs"
  },
  {
    "name": "Notebooks",
    "patterns": ["*.ipynb"],
    "destination": "notebooks"
  }
]
```

Now every time a file appears matching your patterns, it is **automatically moved**.

---

## 🛠 Using VS Code Settings Instead (Optional)

If you prefer **not** to create `autosort.json`, you can define rules in:

### `settings.json`

```json
"autosort.rules": [
  {
    "patterns": ["*.md"],
    "destination": "docs"
  }
]
```

AutoSort automatically uses the settings-based rules when `autosort.json` is absent.

---

## 💡 Examples

### Sort screenshots automatically
```json
{
  "patterns": ["Screenshot*.png"],
  "destination": "images/screenshots"
}
```

### Organize downloaded test files
```json
{
  "patterns": ["test_*.*"],
  "destination": "tests/generated"
}
```

### Keep your repo clean
```json
{
  "patterns": ["*.tmp", "*.cache"],
  "destination": ".cache"
}
```

---

## 📁 Rule Structure

| Field        | Type       | Description                                  |
|--------------|-----------|----------------------------------------------|
| `name`       | string     | Optional label (for clarity)                |
| `patterns`   | string[]   | Glob patterns matched against filenames     |
| `destination`| string     | Folder (relative to workspace root)         |

---

## 🔍 Behavior Notes

✔ AutoSort never overwrites files — it generates numbered versions  
✔ Creates destination folders automatically  
✔ All moves are logged in the VS Code Output panel (`AutoSort`)  
✔ Works with multi-root workspaces  

---

## 🧪 Testing the Extension

1. Press **F5** to launch the Extension Development Host  
2. Create a new folder  
3. Add an `autosort.json` with rules  
4. Create some files  
5. Watch AutoSort immediately reorganize them 🎉  

---

## 💬 Support or Feedback

Have ideas or feature requests?  
Open an issue at:

👉 **https://github.com/QualitySushi/vscode-autosort/issues**

If you find AutoSort useful and want to support further development:

☕ **https://buymeacoffee.com/qualitysushi**

---

## 📦 Open-Source

MIT Licensed — build on top of it, modify it, contribute back!  
Source code:

👉 **https://github.com/QualitySushi/vscode-autosort**
