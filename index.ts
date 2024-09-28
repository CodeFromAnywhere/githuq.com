import html from "./index.html";

export default {
  fetch: (request: Request) => {
    const url = new URL(request.url);
    const [tld, domain, subdomain] = url.hostname.split(".").reverse();

    if (!subdomain || subdomain === "www") {
      const [_, owner, repo, page, branch] = url.pathname.split("/");
      if (!owner) {
        return new Response(html, { headers: { "Content-Type": "text/html" } });
      }
      // redirect https://githuq.com/owner/repo and https://githuq.com/owner and https://githuq.com/owner/repo/tree/branch to https://owner.githuq.com/* (for safety)
      const newUrl = `https://${owner}.${domain}.${tld}/${url.pathname
        .split("/")
        .slice(2)
        .join("/")}`;
      return new Response("Redirecting", {
        status: 307,
        headers: { Location: newUrl },
      });
    }

    return new Response(`sub:${subdomain}, ${request.url}`);
  },
};
