(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initPreloader();
    initHeaderScroll();
    initMobileNav();
    initScrollProgress();
    initThemeWatcher();
    initReveals();
    initSplitReveal();
    initClipReveal();
    initParallax();
    initIndexSection();
    initWorkGallery();
    initLightbox();
    initWordsSpotlight();
    initCounters();
    initLeadForm();
    initLeadFormMore();
    initFaqAccordion();
    initStickyCta();
    if (isFinePointer && !reduceMotion) {
      initMagnetic();
      initShowcaseTilt();
    }
    document.getElementById("year").textContent = new Date().getFullYear();
  });

  /* ---------------- Preloader ---------------- */
  function initPreloader() {
    var el = document.getElementById("preloader");
    if (!el) return;
    var hidden = false;

    function hide() {
      if (hidden) return;
      hidden = true;

      var finished = false;
      function finish() {
        if (finished) return;
        finished = true;
        el.style.display = "none";
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      }

      if (window.gsap && !reduceMotion) {
        gsap.to(el.querySelector(".preloader-mark"), { scale: 1.15, duration: 0.45, ease: "power2.out" });
        gsap.to(el, { opacity: 0, duration: 0.6, delay: 0.3, ease: "power2.inOut", onComplete: finish });
        setTimeout(finish, 1500);
      } else {
        finish();
      }
    }

    window.addEventListener("load", hide);
    setTimeout(hide, 2500);
  }

  /* ---------------- Header scroll state ---------------- */
  function initHeaderScroll() {
    var header = document.getElementById("siteHeader");
    if (!header) return;
    var ticking = false;
    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------------- Mobile nav ---------------- */
  function initMobileNav() {
    var btn = document.getElementById("hamburgerBtn");
    var nav = document.getElementById("mobileNav");
    var header = document.getElementById("siteHeader");
    if (!btn || !nav) return;

    function close() {
      nav.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      if (header) header.classList.remove("nav-open");
    }
    function toggle() {
      var open = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
      if (header) header.classList.toggle("nav-open", open);
    }
    btn.addEventListener("click", toggle);
    nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", close); });
  }

  /* ---------------- Scroll progress bar ---------------- */
  function initScrollProgress() {
    var fill = document.getElementById("scrollProgressFill");
    if (!fill || !window.gsap) return;
    if (window.ScrollTrigger) {
      ScrollTrigger.create({
        start: 0, end: "max",
        onUpdate: function (self) { gsap.set(fill, { scaleX: self.progress }); }
      });
    }
  }

  /* ---------------- Index rail (scrollspy) ---------------- */
  function initThemeWatcher() {
    if (!window.IntersectionObserver) return;

    // Fixed-position chrome (the scroll-progress bar) needs to know whether a
    // dark-background section currently sits behind it, since it can't rely
    // on any single section's own text-color rules.
    var targets = Array.prototype.slice.call(document.querySelectorAll("main > section[id], .site-footer"));
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var isDark = entry.target.dataset.theme === "dark" || entry.target.classList.contains("site-footer");
        document.body.classList.toggle("theme-dark", isDark);
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });

    targets.forEach(function (t) { observer.observe(t); });
  }

  /* ---------------- Scroll reveals ---------------- */
  function initReveals() {
    var els = gsap.utils.toArray(".reveal");
    if (!els.length) return;

    if (reduceMotion || !window.ScrollTrigger) {
      gsap.set(els, { opacity: 1, y: 0 });
      return;
    }

    els.forEach(function (el, i) {
      gsap.set(el, { opacity: 0, y: 28 });
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: (i % 4) * 0.06,
        scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" }
      });
    });
  }

  /* ---------------- Split-text word reveal ---------------- */
  function initSplitReveal() {
    var els = document.querySelectorAll(".split-reveal");
    if (!els.length) return;

    els.forEach(function (el) {
      var words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map(function (w) {
        return '<span class="split-word"><span class="split-word__inner">' + w + "</span></span>";
      }).join(" ");
    });

    if (reduceMotion || !window.gsap) return;

    els.forEach(function (el) {
      var inners = el.querySelectorAll(".split-word__inner");
      gsap.set(inners, { yPercent: 115, rotate: 3 });
      gsap.to(inners, {
        yPercent: 0, rotate: 0, duration: 0.85, ease: "power3.out", stagger: 0.032,
        scrollTrigger: window.ScrollTrigger ? { trigger: el, start: "top 90%", toggleActions: "play none none none" } : undefined
      });
    });
  }

  /* ---------------- Scroll-reveal image clip ---------------- */
  function initClipReveal() {
    var els = document.querySelectorAll(".clip-reveal");
    if (!els.length || reduceMotion || !window.gsap) return;

    els.forEach(function (el) {
      gsap.set(el, { clipPath: "inset(0% 32% 0% 32%)" });
      gsap.to(el, {
        clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power3.out",
        scrollTrigger: window.ScrollTrigger ? { trigger: el, start: "top 88%", toggleActions: "play none none none" } : undefined
      });
    });
  }

  /* ---------------- Parallax images ---------------- */
  function initParallax() {
    var els = document.querySelectorAll(".parallax-img");
    if (!els.length || reduceMotion || !window.gsap || !window.ScrollTrigger) return;

    els.forEach(function (img) {
      gsap.set(img, { scale: 1.12, yPercent: -6 });
      gsap.to(img, {
        yPercent: 6, ease: "none",
        scrollTrigger: {
          trigger: img.closest("figure, .showcase-sofa__clip") || img.parentElement,
          start: "top bottom", end: "bottom top", scrub: 0.6
        }
      });
    });
  }

  /* ---------------- Index section (services directory) ---------------- */
  function initIndexSection() {
    var rows = document.querySelectorAll(".index-row");
    var image = document.getElementById("indexImage");
    var desc = document.getElementById("indexDesc");
    var cta = document.getElementById("indexCta");
    if (!rows.length || !image || !desc) return;

    var data = {
      sofas: {
        img: "assets/img/tabs/sofas.jpg", wa: "a%20sofa",
        desc: "Relax in style with our handcrafted sofas and recliners. Each piece is custom-built using premium materials, offering ergonomic support and luxurious comfort. Choose from modern, classic or contemporary designs tailored to your space and lifestyle."
      },
      recliners: {
        img: "assets/img/gallery/recliners/recliner-10.jpeg", wa: "a%20recliner",
        desc: "Indulge in ultimate comfort with our custom-built recliners. Designed with precision mechanisms, plush cushioning and ergonomic support, our recliners are perfect for unwinding after a long day. Choose manual or motorized options and premium fabrics."
      },
      chairs: {
        img: "assets/img/gallery/chairs/chair-04.jpeg", wa: "a%20chair",
        desc: "Whether it's a cozy reading chair, a sleek dining seat, or an ergonomic office chair, our custom designs bring together comfort and personality, styled to fit any decor."
      },
      beds: {
        img: "assets/img/tabs/beds.jpg", wa: "a%20bed",
        desc: "Experience comfort redefined with our custom-made beds. From statement headboards to storage-integrated frames and premium finishes, every bed is designed to complement your space."
      },
      office: {
        img: "assets/img/tabs/office.jpg", wa: "office%20furniture",
        desc: "From executive desks and conference tables to modular workstations and smart storage solutions, we craft custom office furniture built for comfort and performance."
      },
      interior: {
        img: "assets/img/tabs/interior.jpg", wa: "an%20interior%20project",
        desc: "Go beyond furniture. Our experienced team offers complete interior solutions — from space planning and moodboarding to custom furnishing and decor alignment."
      }
    };

    function setService(key) {
      var d = data[key];
      if (!d) return;
      if (window.gsap && !reduceMotion) {
        gsap.to(image, { opacity: 0, duration: 0.2, onComplete: function () {
          image.src = d.img;
          gsap.to(image, { opacity: 1, duration: 0.35 });
        } });
      } else {
        image.src = d.img;
      }
      desc.textContent = d.desc;
      if (cta) cta.href = "https://wa.me/918700322846?text=Hi%20Nirman%20Furnish%2C%20I%27d%20like%20a%20free%20estimate%20for%20" + d.wa + ".";
      rows.forEach(function (r) {
        r.classList.toggle("is-active", r.dataset.service === key);
      });
    }

    rows.forEach(function (row) {
      row.addEventListener("click", function () { setService(row.dataset.service); });
      row.addEventListener("mouseenter", function () {
        if (isFinePointer) setService(row.dataset.service);
      });
    });
  }

  /* ---------------- Our work (masonry gallery) ---------------- */
  function seq(prefix, count, ext) {
    var out = [];
    for (var i = 1; i <= count; i++) out.push(prefix + "-" + String(i).padStart(2, "0") + "." + ext);
    return out;
  }

  function initWorkGallery() {
    var grid = document.getElementById("workGrid");
    var filtersEl = document.getElementById("workFilters");
    if (!grid || !filtersEl) return;

    var manifest = {
      sofas: ["sofa-09.jpg", "sofa-10.jpg", "sofa-11.jpg", "sofa-12.jpg", "sofa-13.jpg", "sofa-14.jpg", "sofa-15.jpg", "sofa-16.jpg", "sofa-17.jpg", "sofa-18.jpg"],
      recliners: seq("recliner", 14, "jpeg"),
      chairs: ["chair-01.jpeg", "chair-02.jpeg", "chair-03.jpeg", "chair-04.jpeg", "chair-05.jpeg", "chair-06.jpg", "chair-07.jpg", "chair-08.jpg", "chair-09.jpg"],
      beds: seq("bed", 36, "jpg"),
      interior: seq("interior", 4, "jpg")
    };

    function render(key) {
      grid.innerHTML = "";
      manifest[key].forEach(function (file) {
        var img = document.createElement("img");
        img.src = "assets/img/gallery/" + key + "/" + file;
        img.alt = "Nirman Furnish " + key + " restoration";
        img.loading = "lazy";
        img.decoding = "async";
        grid.appendChild(img);
      });

      if (window.gsap && !reduceMotion) {
        gsap.from(grid.children, { opacity: 0, y: 16, duration: 0.5, stagger: 0.03, ease: "power2.out" });
      }
    }

    filtersEl.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;
      filtersEl.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.toggle("is-active", b === btn); });
      render(btn.dataset.gallery);
    });

    render("sofas");
  }

  function initLightbox() {
    var lightbox = document.getElementById("lightbox");
    var img = document.getElementById("lightboxImg");
    var closeBtn = document.getElementById("lightboxClose");
    var grid = document.getElementById("workGrid");
    if (!lightbox || !img || !grid) return;

    function open(src, alt) {
      img.src = src;
      img.alt = alt || "";
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
    function close() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    grid.addEventListener("click", function (e) {
      if (e.target.tagName === "IMG") open(e.target.src, e.target.alt);
    });
    closeBtn.addEventListener("click", close);
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  /* ---------------- Words (testimonial spotlight) ---------------- */
  function initWordsSpotlight() {
    var quoteEl = document.getElementById("wordsQuote");
    var nameEl = document.getElementById("wordsName");
    var dotsEl = document.getElementById("wordsDots");
    var prevBtn = document.getElementById("wordsPrev");
    var nextBtn = document.getElementById("wordsNext");
    if (!quoteEl || !nameEl || !dotsEl) return;

    var testimonials = [
      { name: "Priya Verma", quote: "My recliner stopped working and I thought it was done. They fixed it quickly. Saved me from buying a new one." },
      { name: "Rahul Sharma", quote: "Got my old 7 seater sofa reupholstered. Looks brand new. Pickup and delivery was smooth. Totally worth it." },
      { name: "Amit Gupta", quote: "I was planning to replace my sofa, but they restored it perfectly. Fabric quality is solid and finishing is clean." },
      { name: "Neha Kapoor", quote: "They came home with fabric samples and explained everything clearly. No confusion, no hidden charges." },
      { name: "Sandeep Mehta", quote: "My leather sofa had cracks and sagging cushions. Now it looks premium again. Craftsmanship is actually impressive." },
      { name: "Pooja Malhotra", quote: "Got custom upholstery done for our dining chairs. Stitching and fitting are on point. House feels upgraded." },
      { name: "Rohan Singh", quote: "Fast service and proper communication. Work was done exactly as promised." },
      { name: "Anjali Mishra", quote: "They advised repair instead of replacement. Honest team and very reasonable pricing." },
      { name: "Vikram Joshi", quote: "Foam replacement made a huge difference. Seating feels firm and comfortable again." }
    ];

    var current = 0;
    var timer = null;

    testimonials.forEach(function (_, i) {
      var dot = document.createElement("span");
      if (i === 0) dot.classList.add("is-active");
      dot.addEventListener("click", function () { show(i, true); });
      dotsEl.appendChild(dot);
    });

    function show(i, resetTimer) {
      current = (i + testimonials.length) % testimonials.length;
      var t = testimonials[current];

      if (window.gsap && !reduceMotion) {
        gsap.to([quoteEl, nameEl], { opacity: 0, duration: 0.2, onComplete: function () {
          quoteEl.textContent = "“" + t.quote + "”";
          nameEl.textContent = t.name;
          gsap.to([quoteEl, nameEl], { opacity: 1, duration: 0.35 });
        } });
      } else {
        quoteEl.textContent = "“" + t.quote + "”";
        nameEl.textContent = t.name;
      }

      dotsEl.querySelectorAll("span").forEach(function (d, i2) { d.classList.toggle("is-active", i2 === current); });
      if (resetTimer) restart();
    }

    function restart() {
      if (timer) clearInterval(timer);
      if (reduceMotion) return;
      timer = setInterval(function () { show(current + 1, false); }, 5500);
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { show(current - 1, true); });
    if (nextBtn) nextBtn.addEventListener("click", function () { show(current + 1, true); });

    restart();
  }

  /* ---------------- Counters ---------------- */
  function initCounters() {
    var counters = document.querySelectorAll(".counter");
    if (!counters.length || !window.gsap) return;

    counters.forEach(function (counter) {
      var target = +counter.getAttribute("data-target");
      var suffix = counter.getAttribute("data-suffix") || "";
      var proxy = { value: 0 };

      var opts = {
        value: target, duration: 1.8, ease: "power3.out",
        onUpdate: function () { counter.textContent = Math.floor(proxy.value).toLocaleString("en-IN"); },
        onComplete: function () { counter.textContent = target.toLocaleString("en-IN") + suffix; }
      };

      if (window.ScrollTrigger && !reduceMotion) {
        opts.scrollTrigger = { trigger: counter, start: "top 90%", once: true };
      } else {
        counter.textContent = target.toLocaleString("en-IN") + suffix;
        return;
      }
      gsap.to(proxy, opts);
    });
  }

  /* ---------------- Lead form "add details" disclosure ---------------- */
  function initLeadFormMore() {
    var btn = document.getElementById("leadFormMore");
    var panel = document.getElementById("leadFormExtra");
    if (!btn || !panel) return;

    btn.addEventListener("click", function () {
      var open = panel.hidden;
      panel.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = "";
      var label = document.createElement("span");
      label.textContent = open ? "− Fewer details" : "+ Add project details";
      btn.appendChild(label);
      if (!open) return;
      var hint = document.createElement("span");
      hint.className = "lead-form__more-hint";
      hint.textContent = " (optional)";
      btn.appendChild(hint);
    });
  }

  /* ---------------- FAQ accordion ---------------- */
  function initFaqAccordion() {
    var list = document.getElementById("faqList");
    if (!list) return;

    list.addEventListener("click", function (e) {
      var q = e.target.closest(".faq-item__q");
      if (!q) return;
      var item = q.closest(".faq-item");
      var answer = item.querySelector(".faq-item__a");
      var isOpen = item.classList.contains("is-open");

      list.querySelectorAll(".faq-item.is-open").forEach(function (open) {
        if (open === item) return;
        open.classList.remove("is-open");
        open.querySelector(".faq-item__q").setAttribute("aria-expanded", "false");
        open.querySelector(".faq-item__a").style.maxHeight = null;
      });

      item.classList.toggle("is-open", !isOpen);
      q.setAttribute("aria-expanded", String(!isOpen));
      answer.style.maxHeight = isOpen ? null : answer.scrollHeight + "px";
    });
  }

  /* ---------------- Sticky mobile CTA bar ---------------- */
  function initStickyCta() {
    var bar = document.getElementById("stickyCta");
    var hideNear = document.getElementById("enquire");
    var footer = document.querySelector(".site-footer");
    if (!bar || !window.IntersectionObserver) return;

    var hiddenByForm = false;
    var hiddenByFooter = false;
    function sync() { bar.classList.toggle("is-hidden", hiddenByForm || hiddenByFooter); }

    if (hideNear) {
      new IntersectionObserver(function (entries) {
        hiddenByForm = entries[0].isIntersecting;
        sync();
      }, { rootMargin: "-20% 0px -70% 0px" }).observe(hideNear);
    }
    if (footer) {
      new IntersectionObserver(function (entries) {
        hiddenByFooter = entries[0].isIntersecting;
        sync();
      }, { rootMargin: "0px" }).observe(footer);
    }
  }

  /* ---------------- Lead form -> WhatsApp ---------------- */
  /* Submits via a pre-filled WhatsApp link today; swap this handler for an
     EmailJS send once credentials are set up, keeping the WhatsApp link as a fallback. */
  function initLeadForm() {
    var form = document.getElementById("leadForm");
    var msg = document.getElementById("formMsg");
    if (!form || !msg) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var email = form.email.value.trim();
      var location = form.location.value.trim();
      var propertyType = form.propertyType.value;

      if (!name || !/^[0-9]{10}$/.test(phone)) {
        msg.textContent = "Please fill in your name and a 10-digit phone number.";
        msg.className = "form-msg is-error";
        return;
      }

      var lines = ["Hi Nirman Furnish, I'd like a free estimate.", "Name: " + name, "Phone: " + phone];
      if (email) lines.push("Email: " + email);
      if (location) lines.push("Location: " + location);
      if (propertyType) lines.push("Property Type: " + propertyType);

      var url = "https://wa.me/918700322846?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");

      msg.textContent = "Opening WhatsApp with your details filled in…";
      msg.className = "form-msg is-success";
      form.reset();
    });
  }

  /* ---------------- Magnetic buttons ---------------- */
  function initMagnetic() {
    if (!window.gsap) return;
    var targets = document.querySelectorAll(".btn, .brand-logo");
    targets.forEach(function (el) {
      var moveX = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
      var moveY = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var relX = e.clientX - (rect.left + rect.width / 2);
        var relY = e.clientY - (rect.top + rect.height / 2);
        moveX(relX * 0.25);
        moveY(relY * 0.35);
      });
      el.addEventListener("mouseleave", function () { moveX(0); moveY(0); });
    });
  }

  /* ---------------- Showcase sofa tilt ---------------- */
  function initShowcaseTilt() {
    var wrap = document.getElementById("showcaseTilt");
    if (!wrap || !window.gsap) return;
    var img = wrap.querySelector("img");
    if (!img) return;

    gsap.set(wrap, { transformPerspective: 900, transformStyle: "preserve-3d" });
    var rotateX = gsap.quickTo(img, "rotateX", { duration: 0.5, ease: "power3" });
    var rotateY = gsap.quickTo(img, "rotateY", { duration: 0.5, ease: "power3" });

    wrap.addEventListener("mousemove", function (e) {
      var rect = wrap.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      rotateY(px * 8);
      rotateX(-py * 8);
    });
    wrap.addEventListener("mouseleave", function () { rotateX(0); rotateY(0); });
  }
})();
