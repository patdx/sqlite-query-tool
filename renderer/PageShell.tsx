import { StrictMode, type ReactNode } from 'react';
import type { PageContext } from './types';
import { PageContextProvider } from './usePageContext';

export function PageShell({
  children,
  pageContext,
}: {
  children: ReactNode;
  pageContext: PageContext;
}) {
  return (
    <StrictMode>
      <PageContextProvider pageContext={pageContext}>
        {children}
      </PageContextProvider>
    </StrictMode>
  );
}
