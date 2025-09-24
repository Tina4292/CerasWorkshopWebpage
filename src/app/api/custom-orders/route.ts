import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.projectType || !formData.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Log the form submission (in a real app, you'd save to database or send email)
    console.log('Custom Order Request:', {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      projectType: formData.projectType,
      description: formData.description,
      timeline: formData.timeline,
      budget: formData.budget,
      submittedAt: new Date().toISOString()
    });

    // In a real application, you would:
    // 1. Save to database
    // 2. Send email notification to you
    // 3. Send confirmation email to customer
    // 4. Integrate with your preferred email service (SendGrid, Mailgun, etc.)

    return NextResponse.json(
      { 
        message: 'Custom order request submitted successfully',
        success: true
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing custom order request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}