# How to Publish CogniStudy Live on the Web (Free 🌐)

Follow these simple steps to deploy CogniStudy so that anyone around the world can access it with a public `https://...` link.

---

## Method 1: Deploy with GitHub & Vercel (Recommended — 2 Minutes)

Vercel is the creator of Next.js and hosts applications **100% free with automatic HTTPS/SSL and instant updates**.

### Step 1: Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new) and log in.
2. Name your repository (e.g. `cognistudy-app`) and click **Create repository**.
3. In your project terminal or PowerShell, run:
```powershell
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/cognistudy-app.git
git branch -M main
git push -u origin main
```

---

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and click **Sign Up** / **Log In** (select *Continue with GitHub*).
2. On your Vercel Dashboard, click **Add New...** → **Project**.
3. Select your `cognistudy-app` repository and click **Import**.
4. *(Optional)* Expand **Environment Variables** if you have created your Supabase project:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your-anon-key`
   *(If you haven't set up Supabase yet, you can skip this; CogniStudy automatically runs with resilient local guest profiles!)*
5. Click **Deploy**! 🚀

Within 60 seconds, Vercel will give you a live public URL (e.g., `https://cognistudy-app.vercel.app`) that you can share with anyone!

---

## Method 2: Deploy Directly via Terminal (Vercel CLI)

You can also deploy directly from your computer terminal without creating a GitHub repository:

1. Open PowerShell in this folder:
```powershell
$env:PATH = "C:\Users\devag\AppData\Local\git\cmd;C:\Users\devag\AppData\Local\nodejs;C:\Users\devag\AppData\Local\nodejs\node_modules\npm\bin;$env:PATH"
npx vercel
```
2. Follow the prompts on screen:
   - Log in with your email or GitHub.
   - Confirm project settings (press `Enter` to accept defaults).
3. To deploy to the permanent production URL:
```powershell
npx vercel --prod
```

---

## 3. Setting Up the Supabase Database (Optional for Multi-Device Sync)

1. Create a free database at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in Supabase and paste the entire script from `supabase/schema.sql`, then click **Run**.
3. Copy your **Project URL** and **anon public key** from **Project Settings → API**.
4. Add them to your Vercel Project Settings under **Environment Variables**, then redeploy!
