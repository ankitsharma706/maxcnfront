import React, { useEffect } from 'react';
import { BaseSchema } from './schemaBuilder';

interface JsonLdProps {
  id?: string;
  schema: BaseSchema | BaseSchema[];
  injectInHead?: boolean;
}

/**
 * Sanitizes JSON payload for safe injection inside <script type="application/ld+json">.
 * Prevents XSS breakout vectors such as </script>, <script>, <!--, etc.
 */
export function sanitizeJsonLd(data: unknown): string {
  const jsonString = JSON.stringify(data, null, 2);
  return jsonString
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

/**
 * XSS-Safe JSON-LD Structured Data React Component.
 * Supports both static DOM rendering and dynamic <head> synchronization.
 */
export const JsonLd: React.FC<JsonLdProps> = ({
  id = 'json-ld-schema',
  schema,
  injectInHead = true
}) => {
  const sanitized = sanitizeJsonLd(schema);

  useEffect(() => {
    if (!injectInHead || typeof document === 'undefined') return;

    const scriptId = `schema-${id}`;
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    scriptEl.textContent = sanitized;

    return () => {
      // Clean up script tag on unmount or route transition
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [id, sanitized, injectInHead]);

  if (injectInHead) {
    return null;
  }

  return (
    <script
      id={`schema-${id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};
