import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SQUARE_BASE_URL = process.env.SQUARE_ENVIRONMENT === 'production' 
  ? 'https://connect.squareup.com/v2'
  : 'https://connect.squareupsandbox.com/v2';

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;

export async function GET() {
  try {
    if (!SQUARE_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'Square access token not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(`${SQUARE_BASE_URL}/locations`, {
      headers: {
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Square-Version': '2023-10-18',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Square API Error:', result);
      return NextResponse.json(
        { error: 'Failed to fetch locations', details: result.errors },
        { status: 400 }
      );
    }

    // Return the first active location
    const activeLocation = result.locations?.find((loc: { status: string; id: string; name: string; address?: object }) => loc.status === 'ACTIVE');
    
    if (!activeLocation) {
      return NextResponse.json(
        { error: 'No active locations found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      location: {
        id: activeLocation.id,
        name: activeLocation.name,
        address: activeLocation.address,
        status: activeLocation.status,
      }
    });

  } catch (error) {
    console.error('Location fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch location information' },
      { status: 500 }
    );
  }
}