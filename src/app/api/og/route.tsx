import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get('title') || 'The Ledger';
  const category = searchParams.get('category') || '';

  const satoshiFont = await fetch(
    new URL('../../../../public/fonts/Satoshi-Variable.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());

  const fontSize = title.length > 60 ? 42 : 52;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          backgroundColor: '#FAF8F5',
          padding: '60px',
          fontFamily: 'Satoshi',
        }}
      >
        {category && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 20,
              color: '#E8720C',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {category.replace(/-/g, ' ')}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            fontSize,
            fontWeight: 700,
            color: '#1C1917',
            lineHeight: 1.2,
            maxWidth: '90%',
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 24,
            fontWeight: 700,
            color: '#1C1917',
            opacity: 0.6,
          }}
        >
          The Ledger
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Satoshi',
          data: satoshiFont,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}
