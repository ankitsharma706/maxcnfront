import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem } from '../types';
import { buildBreadcrumbSchema } from '../schema/schemaBuilder';
import { JsonLd } from '../schema/JsonLd';
import { SITE_DOMAIN, ROUTE_REGISTRY } from '../config/seoDefaults';

export interface SemanticBreadcrumbsProps {
  currentPath: string;
  customItems?: BreadcrumbItem[];
  onNavigate?: (path: string) => void;
  className?: string;
}

/**
 * Builds standard hierarchical breadcrumbs from the route registry.
 */
export function generateBreadcrumbItems(currentPath: string): BreadcrumbItem[] {
  const clean = currentPath.toLowerCase().replace(/\/$/, '') || '/';
  const items: BreadcrumbItem[] = [
    {
      position: 1,
      name: 'Home',
      item: `${SITE_DOMAIN}/`
    }
  ];

  if (clean === '/') {
    return items;
  }

  const routeConfig = ROUTE_REGISTRY[clean];
  if (routeConfig?.breadcrumb) {
    if (routeConfig.breadcrumb.parentPath && routeConfig.breadcrumb.parentPath !== '/') {
      const parentConfig = ROUTE_REGISTRY[routeConfig.breadcrumb.parentPath];
      items.push({
        position: items.length + 1,
        name: parentConfig?.breadcrumb?.name || 'Overview',
        item: `${SITE_DOMAIN}${routeConfig.breadcrumb.parentPath}`
      });
    }

    items.push({
      position: items.length + 1,
      name: routeConfig.breadcrumb.name,
      item: `${SITE_DOMAIN}${clean}`
    });
  } else {
    // Fallback: derive name from slug
    const slug = clean.split('/').pop() || '';
    const formatted = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
    items.push({
      position: items.length + 1,
      name: formatted,
      item: `${SITE_DOMAIN}${clean}`
    });
  }

  return items;
}

/**
 * Accessible Semantic Breadcrumb Navigation Component.
 * - Complies with WCAG 2.1 and WAI-ARIA Breadcrumb Pattern.
 * - Dual-mode: Renders Schema.org Microdata + Synchronizes JSON-LD BreadcrumbList in <head>.
 */
export const SemanticBreadcrumbs: React.FC<SemanticBreadcrumbsProps> = ({
  currentPath,
  customItems,
  onNavigate,
  className = ''
}) => {
  const items = customItems || generateBreadcrumbItems(currentPath);

  // Don't render breadcrumbs on home page
  if (items.length <= 1) {
    return null;
  }

  const breadcrumbSchema = buildBreadcrumbSchema(items);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, pathUrl: string) => {
    if (onNavigate) {
      e.preventDefault();
      try {
        const parsed = new URL(pathUrl);
        onNavigate(parsed.pathname || '/');
      } catch {
        onNavigate(pathUrl);
      }
    }
  };

  return (
    <>
      <JsonLd id="breadcrumbs" schema={breadcrumbSchema} />
      <nav
        aria-label="Breadcrumb"
        className={`w-full py-2.5 px-3 sm:px-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400 font-medium ${className}`}
      >
        <ol
          itemScope
          itemType="https://schema.org/BreadcrumbList"
          className="flex items-center flex-wrap gap-1.5 list-none m-0 p-0"
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li
                key={item.item}
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
                className="flex items-center gap-1.5"
              >
                {index === 0 && <Home className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />}
                {isLast ? (
                  <span
                    aria-current="page"
                    itemProp="name"
                    className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[240px]"
                  >
                    {item.name}
                  </span>
                ) : (
                  <a
                    itemProp="item"
                    href={item.item}
                    onClick={(e) => handleClick(e, item.item)}
                    className="hover:text-[#00778A] dark:hover:text-[#00A3BD] transition-colors truncate max-w-[180px]"
                  >
                    <span itemProp="name">{item.name}</span>
                  </a>
                )}
                <meta itemProp="position" content={String(item.position)} />
                {!isLast && (
                  <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-600 shrink-0" aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};
