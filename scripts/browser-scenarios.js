async (page) => {
  const base = "__RG_BASE_URL__";
  const errors = [];
  const checks = [];
  await page.emulateMedia({reducedMotion:"no-preference"});
  const axePath = "__AXE_PATH__";
  const axeViolations = [];
  page.on("pageerror", error => errors.push(String(error)));
  page.on("console", message => { if(message.type()==="error")errors.push(message.text()); });
  const check = (value, label) => { if (!value) throw new Error(label); checks.push(label); };
  const open = async path => { await page.waitForLoadState("networkidle"); const response = await page.goto(base+path,{waitUntil:"networkidle"}); await page.evaluate(()=>document.fonts.ready); return response; };
  const checkSocialPreview = async path => {
    const metadata = await page.evaluate(() => {
      const value = (selector) => document.querySelector(selector)?.getAttribute("content");
      return {image:value('meta[property="og:image"]'),width:value('meta[property="og:image:width"]'),height:value('meta[property="og:image:height"]'),twitter:value('meta[name="twitter:image"]')};
    });
    check(metadata.image === "https://randomgorsey.com/images/og.png" && metadata.width === "1200" && metadata.height === "630" && metadata.twitter === metadata.image, path+" exposes the approved social preview");
  };
  const checkArtworkSizing = async (pace, label) => {
    const dimensions = await page.locator(`main [data-pace="${pace}"]`).evaluate(element => {
      const baseClass = element.classList.item(0);
      if (!baseClass) return null;
      const heightBefore = element.getBoundingClientRect().height;
      const style = document.createElement("style");
      style.textContent = `.${CSS.escape(baseClass)} { height: 100%; }`;
      document.head.appendChild(style);
      const heightAfter = element.getBoundingClientRect().height;
      style.remove();
      return {heightBefore, heightAfter};
    });
    check(dimensions && dimensions.heightBefore >= 200 && Math.abs(dimensions.heightAfter-dimensions.heightBefore)<1, label+" retains its height when component CSS loads last: "+JSON.stringify(dimensions));
  };
  await page.context().clearCookies();
  await page.setViewportSize({width:1440,height:1000});
  await open("/");
  await checkSocialPreview("Home");
  const socialImage=await page.request.get(base+"/images/og.png");
  check(socialImage.status()===200 && socialImage.headers()["content-type"].includes("image/png"),"Social preview image is served as PNG");
  const style=await page.evaluate(()=>({font:getComputedStyle(document.body).fontFamily,color:getComputedStyle(document.body).color,accent:getComputedStyle(document.documentElement).getPropertyValue("--color-accent"),flex:getComputedStyle(document.querySelector("[data-card] .flex")).display}));
  check(style.font.includes("Europa") && style.color==="rgb(240, 240, 230)" && style.accent.trim()!=="" && style.flex==="flex","Production typography, design tokens and Tailwind utilities are compiled");
  const initialTransfer=await page.evaluate(()=>performance.getEntriesByType("resource").reduce((sum,entry)=>sum+entry.transferSize,0));
  check(await page.locator(".studioHeader img,.studioAppIcon").count()===0,"Header contains neither an ornate logo nor a decorative app icon");
  check(!(await page.locator(".studioHeader").innerText()).includes("Images / Words"),"Removed header caption stays absent");
  check(await page.locator("h1").count()===1,"Home has one primary heading");
  check(await page.getByRole("heading",{level:1,name:"Random Gorsey",exact:true}).count()===1,"Original vector artist identity is rendered");
  check(await page.locator("video source,video[src]").count()===0,"Home attaches no decorative video");
  check((await page.locator(".studioNav a").first().evaluate(e=>getComputedStyle(e).fontFamily)).toLowerCase().includes("lisaterminal"),"Navigation uses LisaTerminal");
  const necessary=page.getByRole("button",{name:"Accept only necessary cookies",exact:true});
  await necessary.click();
  check(await page.locator("body").evaluate(element=>element.style.overflow!=="hidden"),"Consent leaves body scroll unlocked");
  await page.getByRole("button",{name:"Cookie preferences",exact:true}).click();
  check(await page.getByRole("region",{name:"Cookie preferences",exact:true}).isVisible(),"Cookie choices can be revisited");
  await page.getByRole("button",{name:"Accept only necessary cookies",exact:true}).click();
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.screenshot({path:"home-desktop.png"});
  check(await page.locator(".studioEffects").count()===0,"No global Effects switch is exposed");
  await page.waitForFunction(()=>document.querySelector("[data-motion='active']")!==null);
  check(await page.locator("main [data-pace=calm]").count()===1,"Home artwork retains its calm pace");
  await checkArtworkSizing("calm", "Home artwork");
  const canvas=page.locator("main canvas").first();
  const firstFrame=await canvas.screenshot();
  await page.waitForTimeout(200);
  const nextFrame=await canvas.screenshot();
  check(!firstFrame.equals(nextFrame),"Permitted generative artwork moves automatically");
  await page.screenshot({path:"home-active.png"});
  await page.getByRole("button",{name:"Index",exact:true}).click();
  check(await page.locator('main a[href^="/posts/"]').count()===56,"All 56 posts are reachable from the index");
  await page.getByRole("button",{name:"Entries",exact:true}).click();
  const before=await page.locator("main article").count();
  await page.getByRole("button",{name:"Load more posts",exact:true}).click();
  await page.waitForFunction(previous=>document.querySelectorAll("main article").length>previous,before);
  check(await page.locator("main article").count()>before,"Journal load-more exposes more records");

  const routes=[];
  for(const path of ["/listen/","/discography/","/about/","/gallery/","/contact/","/posts/56/"]) {
    const response=await open(path);
    check(response.status()===200,path+" returns 200");
    await checkSocialPreview(path);
    check(await page.locator("main h1").count()===1,path+" has a primary heading");
    if(["/listen/","/discography/","/about/","/gallery/","/contact/"].includes(path))check((await page.locator("main h1").evaluate(e=>getComputedStyle(e).fontFamily)).toLowerCase().includes("lisaterminal"),path+" heading uses LisaTerminal");
    await page.screenshot({path:path.replaceAll("/","").replace("posts56","post")+"-desktop.png",fullPage:false});
    await page.addScriptTag({path:axePath});
    const a11y=await page.evaluate(async()=>window.axe.run(document.body,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa","wcag22aa"]}}));
    const serious=a11y.violations.filter(v=>["serious","critical"].includes(v.impact)).map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}));
    axeViolations.push(...serious.map(v=>({path,...v})));
    checks.push(path+" automated accessibility inspected");
    if(["/about/","/gallery/","/contact/"].includes(path))check(await page.locator("main > div").evaluate(e=>getComputedStyle(e).backgroundImage)==="none",path+" uses a solid background");
    if(path==="/discography/"){
      check(await page.locator("main article img").evaluateAll(images=>images.length===2&&images.every(image=>{const box=image.getBoundingClientRect();return Math.abs(box.width-box.height)<1&&image.naturalWidth===image.naturalHeight;})),"Discography uses original square cover images");
      check(await page.locator("main article").evaluateAll(articles=>articles.every(article=>{const art=article.querySelector("img").getBoundingClientRect(),panel=article.querySelector("section[data-tone]").getBoundingClientRect();return art.left<panel.right&&art.right>panel.left&&art.top<panel.bottom&&art.bottom>panel.top;})),"Release windows retain their artwork overlap");
    }
    if(path==="/gallery/")check(await page.locator("main section[data-tone]").count()===16,"Every gallery image has its own window");
    if(path==="/about/"){
      const portrait=page.locator("main video");
      await portrait.waitFor();
      await page.waitForFunction(()=>{const v=document.querySelector("main video");return v&&!v.paused});
      check(await portrait.evaluate(v=>v.muted&&v.autoplay&&v.loop),"Portrait autoplays muted in a loop");
      await page.getByRole("button",{name:/Pause portrait/}).click();
      check(await portrait.evaluate(v=>v.paused),"Portrait pauses without replacing the video");
    }
    routes.push({path,title:await page.title()});
  }
  // Keep the intentionally missing page separate from the console-error audit.
  const missingPage=await page.context().newPage();
  const missing=await missingPage.goto(base+"/posts/999999/",{waitUntil:"networkidle"});
  check(missing.status()===404,"Unknown post returns a real 404");
  await missingPage.close();

  await open("/listen/");
  const listenArtwork=page.locator("main [data-pace=energetic]");
  check(await listenArtwork.count()===1,"Listen artwork uses the energetic pace");
  await checkArtworkSizing("energetic", "Listen artwork");
  await listenArtwork.scrollIntoViewIfNeeded();
  const listenCanvas=listenArtwork.locator("canvas");
  const listenFrame=await listenCanvas.screenshot();
  await page.waitForTimeout(250);
  check(!listenFrame.equals(await listenCanvas.screenshot()),"Listen artwork moves automatically");
  check(await page.locator("iframe").count()===0,"Provider players are absent before explicit loading");
  await page.route("https://open.spotify.com/**",route=>route.fulfill({contentType:"text/html",body:"<html><body>Player test fixture</body></html>"}));
  await page.route("https://w.soundcloud.com/**",route=>route.fulfill({contentType:"text/html",body:"<html><body>Player test fixture</body></html>"}));
  await page.getByRole("button",{name:/Load Spotify/i}).click();
  check(await page.locator("iframe").count()===1,"Explicit Spotify loading creates one player");
  check(await page.locator(".studioSquarePlayer").evaluate(e=>getComputedStyle(e).borderRadius)==="0px","Spotify outer viewport has square corners");
  check(await page.getByRole("navigation",{name:"Music platforms"}).count()===0,"Listen does not repeat the footer platform links");
  check(await page.locator("footer .studioFooterLinks a").first().evaluate(e=>getComputedStyle(e).gap)==="12px","Footer link label and icon use the wider gap");
  await page.getByRole("button",{name:/Load SoundCloud/i}).click();
  check(await page.locator("iframe").count()===1 && /soundcloud/.test(await page.locator("iframe").getAttribute("src")),"Provider handoff retains one player");

  await open("/posts/50/");
  check(await page.locator("iframe").count()===0,"Journal media is absent before explicit loading");
  const journalLoad=page.getByRole("button",{name:/Load SoundCloud|Load Spotify/}).first();
  await journalLoad.click();
  check(await page.locator("iframe").count()===1,"Journal provider loads only on request");
  check(await page.getByRole("link",{name:/Open on SoundCloud|Open on Spotify/}).first().isVisible(),"Loaded journal player retains a direct fallback");
  await page.getByRole("button",{name:/Close player/}).first().click();
  check(await page.locator("iframe").count()===0,"Journal player can be unloaded");

  await open("/gallery/");
  const thumbnail=page.getByRole("button",{name:/Open image:/}).first();
  await thumbnail.click();
  check(await page.getByRole("dialog",{name:"Image viewer"}).isVisible(),"Gallery viewer opens");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Escape");
  check(await thumbnail.evaluate(element=>element===document.activeElement),"Gallery returns focus to the original thumbnail");

  for(const width of [390,320]) {
    await page.setViewportSize({width,height:844});
    await open("/");
    check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),width+"px home has no horizontal overflow");
    await checkArtworkSizing("calm", width+"px home artwork");
    const toggle=page.getByRole("button",{name:"Open menu",exact:true});
    await toggle.click();
    check(await page.getByRole("navigation",{name:"Main navigation"}).getByRole("link",{name:"Contact",exact:true}).isVisible(),width+"px Contact remains reachable");
    await page.keyboard.press("Escape");
    await page.screenshot({path:"home-"+width+".png"});
    for(const path of ["/listen/","/discography/","/about/","/gallery/","/contact/","/posts/56/"]) {
      await open(path);
      check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),width+"px "+path+" has no horizontal overflow");
      if(path==="/listen/") await checkArtworkSizing("energetic", width+"px Listen artwork");
      if(path==="/discography/"){
        check(await page.locator("main article img").evaluateAll(images=>images.every(image=>{const box=image.getBoundingClientRect();return Math.abs(box.width-box.height)<1;})),width+"px Discography covers remain square");
        check(await page.locator("main article").evaluateAll(articles=>articles.every(article=>{const art=article.querySelector("img").getBoundingClientRect(),panel=article.querySelector("section[data-tone]").getBoundingClientRect();return art.left<panel.right&&art.right>panel.left&&art.top<panel.bottom&&art.bottom>panel.top;})),width+"px release windows retain their artwork overlap");
      }
      if(width===390) await page.screenshot({path:path.replaceAll("/","").replace("posts56","post")+"-mobile.png"});
    }
  }
  await page.setViewportSize({width:1440,height:1000});
  for(const path of ["/listen/","/discography/","/about/","/gallery/","/contact/"]) {
    await open(path);
    await page.evaluate(()=>{document.documentElement.style.zoom="200%";});
    check(await page.evaluate(()=>{const heading=document.querySelector("main h1");const rect=heading.getBoundingClientRect();return rect.left>=0&&rect.right<=innerWidth&&document.documentElement.scrollWidth<=document.documentElement.clientWidth;}),"200% CSS zoom reflows "+path+" heading without horizontal overflow");
  }
  await page.emulateMedia({reducedMotion:"reduce"});
  await open("/");
  check(await page.locator("[data-motion=static]").count()>0,"Reduced motion keeps artwork static");
  check(await page.evaluate(()=>performance.getEntriesByType("resource").every(entry=>!/\.(webm|mp4)(\?|$)/.test(entry.name))),"Reduced-motion visit transfers no video");
  await open("/listen/");
  check(await page.locator("main [data-pace=energetic][data-motion=static]").count()===1,"Listen artwork stays still under reduced motion");
  const stillMesh=page.locator("main [data-pace=energetic] canvas");
  await stillMesh.scrollIntoViewIfNeeded();
  const stillFrame=await stillMesh.screenshot();
  await page.waitForTimeout(250);
  check(stillFrame.equals(await stillMesh.screenshot()),"Reduced-motion Listen mesh renders a stable frame");
  check(axeViolations.length===0,"No serious/critical automated accessibility violations: "+JSON.stringify(axeViolations));
  check(errors.length===0,"No browser runtime errors: "+JSON.stringify(errors));
  return {passed:checks.length,checks,routes,errors,axeViolations,initialTransfer,providerMedia:"network fixtures; real provider playback not asserted"};
}
