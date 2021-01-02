(window.lct = window.lct || {}),
  (lct = {
    domain: null,
    fingerprint: null,
    init: (domain) => {
      lct.domain = domain;
      lct.visit();
      window.addEventListener("popstate", () => {
        lct.visit();
      })
    },
    collect: () => {
      const data = new URLSearchParams({
        host: location.host,
        hostname: location.hostname,
        port: location.port ? location.port : 80,
        path: location.pathname,
        href: location.href,
        os: lct.identifyOS(),
        language: navigator.language || navigator.userLanguage,
        useragent: navigator.userAgent,
        domain: lct.domain
      })

      return data.toString();
    },
    visit: async () => {
      const response = await fetch("https://quest.monitor-api.com/visit", {
        method: "POST",
        credentials: "omit",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: lct.collect()
      })
      return response.text()
    },
    identifyOS: () => {
      const userAgent = navigator.userAgent,
        platform = navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'];

      let os = null;

      if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'macos';
      } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'ios';
      } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'windows';
      } else if (/Android/.test(userAgent)) {
        os = 'android';
      } else if (!os && /Linux/.test(platform)) {
        os = 'linux';
      }

      return os;
    }
  });

lct.init("1"); 
