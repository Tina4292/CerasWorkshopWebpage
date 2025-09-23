import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';

// Square API Configuration
const SQUARE_BASE_URL = process.env.SQUARE_ENVIRONMENT === 'production' 
  ? 'https://connect.squareup.com/v2'
  : 'https://connect.squareupsandbox.com/v2';

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;

if (!SQUARE_ACCESS_TOKEN) {
  throw new Error('SQUARE_ACCESS_TOKEN is required');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sourceId, amount, currency = 'USD', locationId } = body;

    if (!sourceId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: sourceId and amount' },
        { status: 400 }
      );
    }

    // Create payment request
    const paymentRequest = {
      source_id: sourceId,
      idempotency_key: randomUUID(),
      amount_money: {
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency,
      },
      location_id: locationId,
      autocomplete: true,
    };

    // Make request to Square API
    const response = await fetch(`${SQUARE_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Square-Version': '2023-10-18',
      },
      body: JSON.stringify(paymentRequest),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Square API Error:', result);
      return NextResponse.json(
        { 
          error: 'Payment failed', 
          details: result.errors?.[0]?.detail || 'Unknown error'
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      payment: result.payment,
      paymentId: result.payment?.id,
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: 'Internal payment processing error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${SQUARE_BASE_URL}/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Square-Version': '2023-10-18',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to retrieve payment', details: result.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      payment: result.payment,
      status: result.payment?.status,
    });

  } catch (error) {
    console.error('Payment retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve payment status' },
      { status: 500 }
    );
  }
}