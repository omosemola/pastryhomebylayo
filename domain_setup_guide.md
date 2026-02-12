# Connecting Your Custom Domain (Namecheap)

This guide explains how to connect your new domain (e.g., `www.pastryhomebylayo.com`) to your website.

## ✅ Phase 1: Connect the FRONTEND (Netlify)
*This is the most important step. It makes your website accessible at your new name.*

1.  **Go to Netlify:**
    *   Click on your site (`pastryhomebylayo`).
    *   Go to **Site Configuration** -> **Domain Management**.
    *   Click **"Add a domain"**.
    *   Enter your new domain name (e.g., `pastryhomebylayo.com`).
    *   Click **Verify** -> **Add Domain**.

2.  **Configure DNS (The easiest way):**
    *   Netlify will ask if you want to use **Netlify DNS**. Click **"Check DNS configuration"** or **"Set up Netlify DNS"**.
    *   Netlify will give you 4 Nameservers. They look like this:
        *   `dns1.p01.nsone.net`
        *   `dns2.p01.nsone.net`
        *   `dns3.p01.nsone.net`
        *   `dns4.p01.nsone.net`
    *   **Keep this tab open.**

3.  **Go to Namecheap:**
    *   Log in and go to **Domain List**.
    *   Click **Manage** next to your domain.
    *   Find the **Nameservers** section.
    *   Change it from "Namecheap BasicDNS" to **"Custom DNS"**.
    *   **Paste the 4 Netlify Nameservers** here.
    *   Click the **Green Checkmark** to save.

4.  **Wait:** It can take up to **24 hours** (usually 1 hour) for this to work globally. Netlify will automatically issue a free SSL certificate (HTTPS) once it connects.

---

## 🔌 Phase 2: Connect the BACKEND (Render) - *Optional*
*You essentially DO NOT need to do this immediately. Your current setup (`onrender.com`) works fine hidden behind the scenes.*

**If you want a professional API URL (e.g., `api.pastryhomebylayo.com`):**

1.  **Go to Render:**
    *   Click on your Web Service.
    *   Go to **Settings** -> **Custom Domains**.
    *   Click **"Add Custom Domain"**.
    *   Enter `api.pastryhomebylayo.com` (or whatever subdomain you want).
    *   Click **Save**.

2.  **Go to Netlify (since Netlify now manages your DNS):**
    *   Go to **Domain Management** -> **DNS Panel**.
    *   Add a new **CNAME Record**:
        *   **Name:** `api`
        *   **Value:** `pastryhomebylayo.onrender.com`
        *   **TTL:** 3600 seconds.
    *   Save.

3.  **Update Your Code:**
    *   If you do this, you MUST update `js/config.js` in your code to point to `https://api.pastryhomebylayo.com/api` instead of the onrender URL.

---

## ⚠️ Important Notes
1.  **Don't touch the code yet:** Your current code is set to allow connections from ANY domain (`cors: *`), so your new domain will work immediately after Phase 1 is done.
2.  **HTTPS:** Netlify handles SSL automatically. Render handles SSL automatically. You don't need to buy SSL from Namecheap.
