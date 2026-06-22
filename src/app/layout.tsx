import type { Metadata } from 'next';
import Layout from '../components/Layout/Layout.component';
import '../index.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'rss-react2026',
  description: 'Booksearch Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
