import { useEffect } from "react";

type SeoHeadProps = {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType?: string;
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image";
  structuredData?: Array<Record<string, unknown>>;
};

type ManagedNode = {
  element: HTMLMetaElement | HTMLLinkElement;
  previousValue: string | null;
  attr: "content" | "href";
  created: boolean;
};

function upsertMetaByName(name: string, content: string): ManagedNode {
  let element = document.head.querySelector(`meta[name=\"${name}\"]`) as HTMLMetaElement | null;
  const created = !element;
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.appendChild(element);
  }

  const previousValue = element.getAttribute("content");
  element.setAttribute("content", content);
  return { element, previousValue, attr: "content", created };
}

function upsertMetaByProperty(property: string, content: string): ManagedNode {
  let element = document.head.querySelector(`meta[property=\"${property}\"]`) as HTMLMetaElement | null;
  const created = !element;
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("property", property);
    document.head.appendChild(element);
  }

  const previousValue = element.getAttribute("content");
  element.setAttribute("content", content);
  return { element, previousValue, attr: "content", created };
}

function upsertCanonical(href: string): ManagedNode {
  let element = document.head.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
  const created = !element;
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  const previousValue = element.getAttribute("href");
  element.setAttribute("href", href);
  return { element, previousValue, attr: "href", created };
}

export default function SeoHead({
  title,
  description,
  canonicalUrl,
  ogType = "website",
  ogImage,
  twitterCard = "summary_large_image",
  structuredData = [],
}: SeoHeadProps) {
  useEffect(() => {
    const previousTitle = document.title;

    const managedNodes: ManagedNode[] = [
      upsertMetaByName("description", description),
      upsertCanonical(canonicalUrl),
      upsertMetaByProperty("og:title", title),
      upsertMetaByProperty("og:description", description),
      upsertMetaByProperty("og:type", ogType),
      upsertMetaByProperty("og:url", canonicalUrl),
      upsertMetaByName("twitter:card", twitterCard),
      upsertMetaByName("twitter:title", title),
      upsertMetaByName("twitter:description", description),
    ];

    if (ogImage) {
      managedNodes.push(upsertMetaByProperty("og:image", ogImage));
      managedNodes.push(upsertMetaByName("twitter:image", ogImage));
    }

    document.title = title;

    const jsonLdScripts: HTMLScriptElement[] = [];
    structuredData.forEach((entry) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-qwik-seo-jsonld", "true");
      script.text = JSON.stringify(entry);
      document.head.appendChild(script);
      jsonLdScripts.push(script);
    });

    return () => {
      document.title = previousTitle;
      managedNodes.forEach(({ element, previousValue, created, attr }) => {
        if (created) {
          element.remove();
          return;
        }
        if (previousValue === null) {
          element.removeAttribute(attr);
          return;
        }
        element.setAttribute(attr, previousValue);
      });
      jsonLdScripts.forEach((script) => script.remove());
    };
  }, [title, description, canonicalUrl, ogType, ogImage, twitterCard, structuredData]);

  return null;
}
