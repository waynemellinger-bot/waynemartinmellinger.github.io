# Publishing the new site

Nothing has been pushed or deployed. Your live site is still the original single page.
There are two ways to publish. **Way 1 is easier and less error-prone.**

Before either: read `DECISIONS-FOR-WAYNE.md`, items A1–A4. Publishing makes the Research
page's project statuses and the new page text public.

---

## Way 1 — Link GitHub to Claude, and I push it (about 5 minutes of your time)

1. In Claude: **Settings → Connectors → GitHub → Connect**, and sign in as `waynemellinger-bot`.
2. Tell me in this conversation: "GitHub is linked, push the site." I push the branch
   `archive-rebuild` and open a pull request into `main`. GitHub then builds and checks it,
   without publishing.
3. When the pull request shows a green check, follow steps 7–9 of Way 2 below.

## Way 2 — Upload it yourself with GitHub Desktop (no command line, about 20 minutes)

You need: the ZIP `waynemartinmellinger-site-source-2026-10-07.zip`, a Mac or PC, and your
GitHub sign-in.

1. Install **GitHub Desktop** from <https://desktop.github.com/> and sign in as `waynemellinger-bot`.
2. **File → Clone Repository**, choose `waynemellinger-bot/waynemartinmellinger.github.io`, click **Clone**.
3. **Current Branch → New Branch**, name it `site-rebuild`, click **Create Branch**.
4. **Repository → Show in Finder** (Mac) or **Show in Explorer** (PC). Make hidden files
   visible: on a Mac press **Cmd + Shift + .** (period); on Windows, View → Show → Hidden items.
5. In that folder, delete everything **except the `.git` folder**. (That removes the old
   `index.html`, its duplicate `index (1).html` and `CNAME`; all three are carried in the new files.)
6. Unzip the ZIP. Open the folder inside it, `waynemartinmellinger-site`. Select **everything**
   in it, including the hidden `.github` folder and `.gitignore` file, and copy it into the
   repository folder.
7. Back in GitHub Desktop, type the summary "Complete site rebuild", click **Commit to
   site-rebuild**, then **Publish branch**.
8. On github.com, open the repository. Click **Compare & pull request** (or **Pull requests →
   New**, base `main`, compare `site-rebuild`), then **Create pull request**. Wait until the
   check turns **green** (2–3 minutes). It builds and checks the site but does not publish it.
   If it turns red, click **Details**, copy the message, and send it to me.
9. Then, back to back:
   a. **Settings → Pages → Build and deployment → Source: GitHub Actions.** Leave the custom
      domain as it is.
   b. Return to the pull request and click **Merge pull request → Confirm merge**.
   GitHub publishes the site within a few minutes (watch the **Actions** tab). Do 9a and 9b
   together: between them your site may briefly show an error page.
10. Visit <https://waynemartinmellinger.com/> and reload (Cmd + Shift + R). Check the home page,
    the menu on your phone, and a poem.

### If something goes wrong after publishing

On the merged pull request, click **Revert**, then merge the revert. Then **Settings → Pages
→ Source: Deploy from a branch**, branch `main`, folder `/ (root)`. The old page returns.

### After publishing

- In Google Search Console, submit `https://waynemartinmellinger.com/sitemap.xml` (it now
  lists all 63 pages).
- Run a link checker on the live site (for example <https://validator.w3.org/checklink>), since
  links to other sites could not be tested before publishing.

## Also in this package

`waynemartinmellinger-full-history.bundle` is the complete project history (branches `main`,
`mobile-hotfix`, `archive-rebuild`; tags `legacy-original`, `noozhawk-pilot-accepted`). Keep it
as a backup. A developer can restore everything from it with
`git clone waynemartinmellinger-full-history.bundle`.
