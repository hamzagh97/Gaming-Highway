import { ArgumentsHost, NotFoundException } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions';

// The only request fields the filter reads.
interface FakeRequest {
  originalUrl: string;
  method: string;
  id?: string;
}

// Runs the filter once and returns what it sent back to the client.
function runFilter(
  exception: unknown,
  request: FakeRequest = { originalUrl: '/api/v1/x', method: 'GET' },
) {
  const sent = { status: 0, body: {} as Record<string, unknown> };

  // The filter calls response.status(404).json({...}). We write both down.
  const response = {
    status(code: number) {
      sent.status = code;
      return this; // gives back the response, so .json() can be called next
    },
    json(body: Record<string, unknown>) {
      sent.body = body;
    },
  };

  // The filter asks the host for the request and the response.
  const host = {
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => response,
    }),
  } as ArgumentsHost;

  new AllExceptionsFilter().catch(exception, host);
  return sent;
}

describe('AllExceptionsFilter', () => {
  it('keeps the status and message of a NotFoundException', () => {
    const sent = runFilter(new NotFoundException('x'));
    expect(sent.status).toBe(404);
    expect(sent.body.message).toBe('x');
  });
});
