import React from 'react';
import { PassThrough } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import App, { AppContent, createPortfolioQueryClient } from './App';
import {
  blogService,
  educationService,
  experienceService,
  profileService,
  projectService,
  skillService,
} from './services/portfolioService';
import {
  SITE_URL,
  blogListSeo,
  buildSeoHead,
  createBlogPostSeo,
  defaultSeo,
  notFoundSeo,
  projectsSeo,
  SeoMeta,
} from './seo';

const BLOG_LIST_PARAMS = { category: undefined, page: 1, per_page: 9 };
const BLOG_RELATED_PARAMS = { per_page: 50 };

interface RenderResult {
  dehydratedState: unknown;
  head: string;
  html: string;
  statusCode: number;
}

const safePrefetch = async (promise: Promise<unknown>) => {
  try {
    await promise;
  } catch (error) {
    console.error('SSR prefetch failed:', error);
  }
};

const prefetchSharedLayout = (queryClient: QueryClient) =>
  safePrefetch(queryClient.prefetchQuery({
    queryKey: ['profile'],
    queryFn: profileService.getProfile,
  }));

const prefetchHome = async (queryClient: QueryClient) => {
  await Promise.all([
    prefetchSharedLayout(queryClient),
    safePrefetch(queryClient.prefetchQuery({
      queryKey: ['experiences'],
      queryFn: experienceService.getAll,
    })),
    safePrefetch(queryClient.prefetchQuery({
      queryKey: ['skills', { grouped: true }],
      queryFn: skillService.getGrouped,
    })),
    safePrefetch(queryClient.prefetchQuery({
      queryKey: ['projects', undefined],
      queryFn: () => projectService.getAll(undefined),
    })),
    safePrefetch(queryClient.prefetchQuery({
      queryKey: ['education'],
      queryFn: educationService.getAll,
    })),
  ]);
};

const prepareRequest = async (url: string, queryClient: QueryClient): Promise<{ seo: SeoMeta; statusCode: number }> => {
  const requestUrl = new URL(url, SITE_URL);
  const pathname = requestUrl.pathname.replace(/\/+$/, '') || '/';

  if (pathname === '/') {
    await prefetchHome(queryClient);
    return { seo: defaultSeo, statusCode: 200 };
  }

  if (pathname === '/blog') {
    await Promise.all([
      prefetchSharedLayout(queryClient),
      safePrefetch(queryClient.prefetchQuery({
        queryKey: ['blogs', BLOG_LIST_PARAMS],
        queryFn: () => blogService.getAll(BLOG_LIST_PARAMS),
      })),
      safePrefetch(queryClient.prefetchQuery({
        queryKey: ['blogs', 'categories'],
        queryFn: blogService.getCategories,
      })),
    ]);
    return { seo: blogListSeo, statusCode: 200 };
  }

  if (pathname.startsWith('/blog/')) {
    const slug = decodeURIComponent(pathname.replace('/blog/', ''));
    await prefetchSharedLayout(queryClient);

    try {
      const post = await queryClient.fetchQuery({
        queryKey: ['blog', slug],
        queryFn: () => blogService.getBySlug(slug),
      });

      await safePrefetch(queryClient.prefetchQuery({
        queryKey: ['blogs', BLOG_RELATED_PARAMS],
        queryFn: () => blogService.getAll(BLOG_RELATED_PARAMS),
      }));

      return {
        seo: createBlogPostSeo(post, `${SITE_URL}/blog/${encodeURIComponent(slug)}`),
        statusCode: 200,
      };
    } catch (error) {
      console.error(`SSR blog post not found for slug "${slug}":`, error);
      return {
        seo: {
          ...notFoundSeo,
          url: `${SITE_URL}/blog/${encodeURIComponent(slug)}`,
        },
        statusCode: 404,
      };
    }
  }

  if (pathname === '/projects') {
    await Promise.all([
      prefetchSharedLayout(queryClient),
      safePrefetch(queryClient.prefetchQuery({
        queryKey: ['projects', undefined],
        queryFn: () => projectService.getAll(undefined),
      })),
    ]);
    return { seo: projectsSeo, statusCode: 200 };
  }

  await prefetchSharedLayout(queryClient);
  return {
    seo: {
      ...notFoundSeo,
      url: `${SITE_URL}${pathname}`,
    },
    statusCode: 404,
  };
};

const renderAppToString = (element: React.ReactElement) => new Promise<string>((resolve, reject) => {
  let html = '';
  let didError = false;
  let didPipe = false;
  const stream = new PassThrough();
  let abortTimer: ReturnType<typeof setTimeout> | null = null;

  const clearAbortTimer = () => {
    if (abortTimer) {
      clearTimeout(abortTimer);
      abortTimer = null;
    }
  };

  stream.on('data', (chunk) => {
    html += chunk.toString();
  });
  stream.on('end', () => {
    clearAbortTimer();
    didError ? reject(new Error('React SSR stream failed')) : resolve(html);
  });
  stream.on('error', (error) => {
    clearAbortTimer();
    reject(error);
  });

  const { abort, pipe } = renderToPipeableStream(element, {
    onAllReady() {
      if (didPipe) return;
      didPipe = true;
      pipe(stream);
    },
    onShellError(error) {
      reject(error);
    },
    onError(error) {
      didError = true;
      console.error('React SSR error:', error);
    },
  });

  abortTimer = setTimeout(abort, 10000);
});

export async function render(url: string): Promise<RenderResult> {
  const queryClient = createPortfolioQueryClient();
  const { seo, statusCode } = await prepareRequest(url, queryClient);
  const dehydratedState = dehydrate(queryClient);
  const html = await renderAppToString(
    <App
      dehydratedState={dehydratedState}
      queryClient={queryClient}
      router={(
        <MemoryRouter initialEntries={[url]}>
          <AppContent />
        </MemoryRouter>
      )}
    />
  );

  return {
    dehydratedState,
    head: buildSeoHead(seo),
    html,
    statusCode,
  };
}
