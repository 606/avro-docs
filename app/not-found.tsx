import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>404 - Page Not Found</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Sorry, the documentation page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/">← Back to Home</Link>
    </div>
  );
}
