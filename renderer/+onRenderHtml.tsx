import ReactDOMServer from 'react-dom/server';
import { dangerouslySkipEscape, escapeInject } from 'vike/server';
import { PageShell } from './PageShell';
import logoUrl from './logo.svg';
import type { PageContextServer } from './types';

export async function onRenderHtml(pageContext: PageContextServer) {
  const { Page, pageProps } = pageContext;
  // This render() hook only supports SSR, see https://vike.dev/render-modes for how to modify render() to support SPA
  if (!Page)
    throw new Error('My render() hook expects pageContext.Page to be defined');
  const pageHtml = ReactDOMServer.renderToString(
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>,
  );

  // See https://vike.dev/head
  const { documentProps } = pageContext.exports;
  const title = (documentProps && documentProps.title) || 'SQLite Query Tool';
  const desc =
    (documentProps && documentProps.description) || 'App using Vite + vike';

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
        <script>window.global = globalThis;</script>
      </head>
      <body class="max-w-xl p-4 mx-auto">
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vike.dev/page-redirection
    },
  };
}
