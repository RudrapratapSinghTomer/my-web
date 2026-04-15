# 🕷️ Spider-Man Experience Website

A fun, interactive Spider-Man themed website with music, scroll-triggered questions, and a running "No" button!

---

## 📁 Folder Structure

```
my web/
├── index.html          # Main HTML file
├── styles.css          # All styling & animations
├── script.js           # Interactivity logic
├── assets/             # ⚠️ ASSETS FOLDER
│   ├── spiderverse-video.mp4 # Background video
│   └── gwen-quote.mp4        # (Optional) Quote video
└── README.md           # This file
```

---

## 🚀 Setup Instructions

### Step 1: Create Assets Folder
1. Inside the `my web` folder, create a new folder named `assets`

### Step 2: Add Your Media Files

**For the Video Background:**
- Place your video in the `assets` folder.
- Rename it to `spiderverse-video.mp4`.

### Step 3: Open the Website
- Double-click `index.html` to open in your browser
- Or right-click → Open with → Your preferred browser

---

## 🎮 Features

| Feature | Description |
|---------|-------------|
| 🎵 **Active Audio** | Tap play to hear the Sunflower Spider-Verse Mix (Local) |
| 🕷️ **Animated Hero** | Interactive Spider-Man intro that reacts to your stay |
| 📜 **Scroll Vibe** | Real-time Vibe Meter that tracks your dimension status |
| ✅ **Quiz Logic** | Hidden paths and "Wrong Timeline" bans for fake options |
| 🏃 **Runner Button** | The "No" button that has a mind of its own |
| 🕸️ **Web Cursor** | Custom web-slinger cursor with physics-based pulls |
| 🎉 **Canon Event** | Enter ↑↑↓↓←→←→BA for a **Dimension Shift** (Surprise!) |

---

## 🌐 Make It Accessible From Anywhere

### Option 1: Netlify (Easiest - Free)
1. Go to [netlify.com](https://netlify.com)
2. Sign up for free
3. Drag & drop the `my web` folder onto their dashboard
4. Get a shareable link instantly!

### Option 2: GitHub Pages (Free)
1. Create a GitHub account
2. Create a new repository named `yourusername.github.io`
3. Upload all files from `my web` folder
4. Your site will be live at `https://yourusername.github.io`

### Option 3: Vercel (Free)
1. Go to [vercel.com](https://vercel.com)
2. Sign up and import your folder
3. Deploy instantly with a shareable URL

---

## 🎨 Customization

### Change Colors
Edit `style.css` and look for these color codes:
- `#ba1728` - Spider-Man Red
- `#176bba` - Spider-Man Blue
- `#17ba6b` - Success Green

### Change Questions
Edit `index.html` and modify the text inside the `<h2 class="question">` tags

### Adjust Running Button Behavior
Edit `script.js` and find the `moveNoButton()` function

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Video not showing | Check `assets/spiderman.mp4` exists |
| Music not playing | Check `assets/sunflower.mp3` exists |
| Animations not working | Try a different browser (Chrome recommended) |
| No button not running | Make sure JavaScript is enabled |

---

## 📱 Browser Compatibility

- ✅ Chrome (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Mobile browsers (some features may vary)

---

## 🕸️ Enjoy Your Spider-Man Experience!

Made with ❤️ and 🕷️
