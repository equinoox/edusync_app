import { auth } from '@clerk/nextjs/server';
import { getTokenStatus } from '@/features/tokens/server/token-limit.service';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const tokenStatus = await getTokenStatus(userId);

    return new Response(
      JSON.stringify(tokenStatus),
      { status: 200 }
    );
  } catch (error) {
    console.error('Token status error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}
