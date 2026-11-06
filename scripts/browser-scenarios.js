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
  const open = async path => { const response = await page.goto(base+path,{waitUntil:"domcontentloaded"}); await page.evaluate(()=>document.fonts.ready); return response; };
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
  check((await page.locator('#journal [data-card] h3').first().evaluate(e=>getComputedStyle(e).fontFamily)).toLowerCase().includes('lisaterminal'),"Journal entry titles use Lisa Terminal Paper");
  check(await page.locator('#journal').evaluate(e=>getComputedStyle(e,'::before').backgroundImage)==="none","Journal has no portrait background");
  check(await page.locator("video source,video[src]").count()===0,"Home attaches no decorative video");
  check((await page.locator(".studioNav a").first().evaluate(e=>getComputedStyle(e).fontFamily)).toLowerCase().includes("lisaterminal"),"Navigation uses LisaTerminal");
  const necessary=page.getByRole("button",{name:"Accept only necessary cookies",exact:true});
  await necessary.click();
  check(await page.locator("body").evaluate(element=>element.style.overflow!=="hidden"),"Consent leaves body scroll unlocked");
  const footerCookie=page.locator(".studioFooterBottom").getByRole("button",{name:"Cookie preferences",exact:true});
  const footerContact=page.locator(".studioFooterBottom").getByRole("link",{name:"Contact"});
  check(await footerCookie.evaluate(e=>getComputedStyle(e).textDecorationLine)==="none" && await footerContact.evaluate(e=>getComputedStyle(e).textDecorationLine)==="none","Footer links and cookie preferences share their resting style");
  await footerCookie.hover();
  check(await footerCookie.evaluate(e=>getComputedStyle(e).textDecorationLine)==="underline","Cookie preferences underline on hover");
  await footerContact.hover();
  check(await footerContact.locator(".studioFooterLinkLabel").evaluate(e=>getComputedStyle(e).textDecorationLine)==="underline" && await footerContact.locator('[aria-hidden="true"]').evaluate(e=>getComputedStyle(e).textDecorationLine)==="none","Footer link text underlines without underlining the arrow");
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
  check(await page.locator('main a[href^="/posts/"]').count()===65,"All 65 posts are reachable from the index");
  check((await page.locator('#journal ol li a span').first().evaluate(e=>getComputedStyle(e).fontFamily)).toLowerCase().includes('lisaterminal'),"Journal index titles use Lisa Terminal Paper");
  await page.getByRole("button",{name:"Entries",exact:true}).click();
  const before=await page.locator("main article").count();
  await page.getByRole("button",{name:"Load more posts",exact:true}).click();
  await page.waitForFunction(previous=>document.querySelectorAll("main article").length>previous,before);
  check(await page.locator("main article").count()>before,"Journal load-more exposes more records");

  const routes=[];
  for(const path of ["/listen/","/discography/","/about/","/gallery/","/contact/","/posts/65/"]) {
    const response=await open(path);
    check(response.status()===200,path+" returns 200");
    await checkSocialPreview(path);
    check(await page.locator("main h1").count()===1,path+" has a primary heading");
    if(path==="/posts/65/")check((await page.locator('main h1').evaluate(e=>getComputedStyle(e).fontFamily)).toLowerCase().includes('lisaterminal'),"Individual journal title uses Lisa Terminal Paper");
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
    if(path==="/gallery/"){
      check(await page.locator("main section[data-tone]").count()===18,"Every gallery image has its own window");
      check(await page.getByRole("img",{name:"Random Gorsey Grit Poster"}).count()===1,"The Grit poster appears in the gallery");
      check(await page.getByRole("img",{name:"Random Gorsey Grit Poster"}).evaluate(e=>{const box=e.getBoundingClientRect();return Math.abs(box.width/box.height-1086/1448)<0.01;}),"The Grit poster retains its full portrait proportions");
      check(await page.getByText("UNTITLED_09.JPG",{exact:true}).count()===1,"The portrait window has the requested title");
      check(await page.getByRole("img",{name:"Shadowed portrait wearing a beanie and glasses"}).evaluate(e=>{const box=e.getBoundingClientRect();return Math.abs(box.width/box.height-1)<0.01;}),"The portrait retains its square proportions");
    }
    if(path==="/about/"){
      const portrait=page.locator("main video");
      await portrait.waitFor();
      await page.waitForFunction(()=>{const v=document.querySelector("main video");return v&&!v.paused});
      check(await portrait.evaluate(v=>v.muted&&v.autoplay&&v.loop),"Portrait autoplays muted in a loop");
      check(await portrait.evaluate(v=>{const s=getComputedStyle(v.parentElement,"::after");return s.backgroundImage.includes("repeating-linear-gradient")&&s.pointerEvents==="none";}),"Interlacing is decorative and leaves the video controls usable");
      check(await page.locator('section[aria-label="Artist biography"] > section').evaluateAll(panels=>panels.length===2&&getComputedStyle(panels[0]).backgroundColor===getComputedStyle(panels[1]).backgroundColor),"Portrait and biography windows use the same gray");
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
  const rate=8000, samples=rate*4, wave=Buffer.alloc(44+samples*2);
  wave.write("RIFF",0);wave.writeUInt32LE(36+samples*2,4);wave.write("WAVEfmt ",8);wave.writeUInt32LE(16,16);wave.writeUInt16LE(1,20);wave.writeUInt16LE(1,22);wave.writeUInt32LE(rate,24);wave.writeUInt32LE(rate*2,28);wave.writeUInt16LE(2,32);wave.writeUInt16LE(16,34);wave.write("data",36);wave.writeUInt32LE(samples*2,40);
  for(let i=0;i<samples;i++)wave.writeInt16LE(Math.round(3000*Math.sin(2*Math.PI*220*i/rate)),44+i*2);
  const playerFixture=`<html><body><button onclick="document.querySelector('audio').play()">Play test audio</button><audio muted loop src="data:audio/wav;base64,${wave.toString("base64")}"></audio></body></html>`;
  await page.route("https://open.spotify.com/**",route=>route.fulfill({contentType:"text/html",body:playerFixture}));
  await page.route("https://w.soundcloud.com/**",route=>route.fulfill({contentType:"text/html",body:"<html><body>Player test fixture</body></html>"}));
  await page.getByRole("button",{name:/Load Spotify/i}).click();
  check(await page.locator("iframe").count()===1,"Explicit Spotify loading creates one player");
  check(await page.locator(".studioSquarePlayer").evaluate(e=>getComputedStyle(e).borderRadius)==="0px","Spotify outer viewport has square corners");
  await page.frameLocator('iframe[title="Spotify player"]').getByRole("button",{name:"Play test audio"}).click();
  await page.waitForTimeout(200);
  await page.evaluate(()=>{window.__rgPersistentFrame=document.querySelector('iframe[title="Spotify player"]');});
  const beforeNavigation=await page.frameLocator('iframe[title="Spotify player"]').locator("audio").evaluate(a=>a.currentTime);
  await page.getByRole("button",{name:"Minimize player"}).click();
  check(await page.evaluate(()=>window.__rgPersistentFrame===document.querySelector('iframe[title="Spotify player"]')),"Minimizing retains the same player iframe");
  await page.getByRole("button",{name:"Expand player"}).click();
  await page.getByRole("navigation",{name:"Main navigation"}).getByRole("link",{name:"About",exact:true}).click();
  await page.waitForURL("**/about/");
  await page.getByRole("button",{name:"Expand player"}).waitFor();
  check(await page.evaluate(()=>window.__rgPersistentFrame===document.querySelector('iframe[title="Spotify player"]')),"Client navigation retains the same player iframe");
  await page.waitForTimeout(500);
  const afterNavigation=await page.locator('iframe[title="Spotify player"]').contentFrame().locator("audio").evaluate(a=>({time:a.currentTime,paused:a.paused}));
  check(!afterNavigation.paused && afterNavigation.time>beforeNavigation,"Playback continues after minimizing and navigating");
  await page.getByRole("navigation",{name:"Main navigation"}).getByRole("link",{name:"Listen",exact:true}).click();
  await page.waitForURL("**/listen/");
  await page.getByRole("button",{name:"Minimize player"}).waitFor();
  check(await page.evaluate(()=>window.__rgPersistentFrame===document.querySelector('iframe[title="Spotify player"]')),"Returning to Listen restores the same player");
  check(await page.getByRole("navigation",{name:"Music platforms"}).count()===0,"Listen does not repeat the footer platform links");
  check(await page.locator("footer .studioFooterLinks a").first().evaluate(e=>getComputedStyle(e).gap)==="12px","Footer link label and icon use the wider gap");
  await page.getByRole("button",{name:/Load SoundCloud/i}).click();
  check(await page.locator("iframe").count()===1 && /soundcloud/.test(await page.locator("iframe").getAttribute("src")),"Provider handoff retains one player");
  await page.getByRole("button",{name:"Close player",exact:true}).click();

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

  await page.setViewportSize({width:1104,height:844});
  check(await page.locator("footer .studioFooterLinks a").evaluateAll(links=>links.length===5&&links.every(link=>Math.abs(link.getBoundingClientRect().top-links[0].getBoundingClientRect().top)<1)),"All footer platform links fit on one row at 1104px");

  await page.setViewportSize({width:1920,height:1000});
  await open("/listen/");
  const desktopEdges=await page.evaluate(()=>{
    const box=selector=>document.querySelector(selector)?.getBoundingClientRect();
    const header=document.querySelector(".studioHeaderBar");
    const main=box("main .studioPage");
    const footer=document.querySelector(".studioFooter");
    const footerTop=box(".studioFooterTop");
    return {
      headerInset:parseFloat(getComputedStyle(header).paddingLeft),
      mainLeft:main?.left,
      mainRight:main?.right,
      footerInset:parseFloat(getComputedStyle(footer).paddingLeft),
      footerTopLeft:footerTop?.left,
      footerTopRight:footerTop?.right,
      viewport:innerWidth
    };
  });
  check(Math.abs(desktopEdges.mainLeft-desktopEdges.headerInset)<1&&Math.abs(desktopEdges.viewport-desktopEdges.mainRight-desktopEdges.headerInset)<1,"1920px page shell aligns to the header gutter");
  check(Math.abs(desktopEdges.footerInset-desktopEdges.headerInset)<1&&Math.abs(desktopEdges.footerTopLeft-desktopEdges.headerInset)<1&&Math.abs(desktopEdges.viewport-desktopEdges.footerTopRight-desktopEdges.headerInset)<1,"1920px footer content aligns to the header gutter");

  await open("/");
  check(await page.locator("#journal").evaluate(section=>{const rect=section.getBoundingClientRect(),inset=parseFloat(getComputedStyle(document.querySelector(".studioHeaderBar")).paddingLeft);return Math.abs(rect.left-inset)<1&&Math.abs(innerWidth-rect.right-inset)<1;}),"1920px journal spans the header-aligned content field");

  await open("/contact/");
  check(await page.locator("main [class*=contactWindow]").evaluate(element=>{const rect=element.getBoundingClientRect(),inset=parseFloat(getComputedStyle(document.querySelector(".studioHeaderBar")).paddingLeft);return Math.abs(rect.left-inset)<1&&Math.abs(rect.width-72*16)<1;}),"1920px contact window stays left-aligned and capped at 72rem");

  await open("/about/");
  check(await page.locator('section[aria-label="Artist biography"] > section').first().evaluate(element=>element.getBoundingClientRect().width<=30*16+1),"1920px About portrait window stays capped at 30rem");
  check(await page.locator('section[aria-label="Artist biography"] > section').nth(1).evaluate(element=>element.getBoundingClientRect().width<=44*16+1),"1920px About biography window stays capped at 44rem");

  await open("/listen/");
  check(await page.locator("main [class*=console]").evaluate(element=>{const rect=element.getBoundingClientRect(),inset=parseFloat(getComputedStyle(document.querySelector(".studioHeaderBar")).paddingLeft);return Math.abs(rect.left-inset)<1&&rect.width<=78*16+1;}),"1920px listening console stays left-aligned and capped at 78rem");
  check(await page.locator("main [class*=playerWindow]").evaluate(element=>element.getBoundingClientRect().width<=44*16+1),"1920px player window stays capped at 44rem");

  await open("/gallery/");
  check(await page.locator("main [class*=contactSheet]").evaluate(element=>getComputedStyle(element).gridTemplateColumns.split(" ").length===4),"1920px gallery uses four columns instead of stretching three windows");

  await open("/discography/");
  check(await page.locator("main article").evaluateAll(articles=>articles.length===2&&articles.every(article=>{const rect=article.getBoundingClientRect(),inset=parseFloat(getComputedStyle(document.querySelector(".studioHeaderBar")).paddingLeft);return Math.abs(rect.left-inset)<1&&rect.width<=78*16+1;})),"1920px release compositions stay left-aligned and capped at 78rem");
  check(await page.locator("main article img").evaluateAll(images=>images.length===2&&images.every(image=>{const box=image.getBoundingClientRect();return Math.abs(box.width-box.height)<1;})),"1920px Discography covers remain square");
  check(await page.locator("main article section[data-tone]").evaluateAll(panels=>panels.length===2&&panels.every(panel=>panel.getBoundingClientRect().width<=43*16+1)),"1920px release windows stay capped at 43rem");
  check(await page.locator("main article").evaluateAll(articles=>articles.every(article=>{const art=article.querySelector("img").getBoundingClientRect(),panel=article.querySelector("section[data-tone]").getBoundingClientRect();return art.left<panel.right&&art.right>panel.left&&art.top<panel.bottom&&art.bottom>panel.top;})),"1920px release windows retain their artwork overlap");

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
    for(const path of ["/listen/","/discography/","/about/","/gallery/","/contact/","/posts/65/"]) {
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
