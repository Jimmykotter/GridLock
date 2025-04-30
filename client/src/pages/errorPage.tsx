import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom';

/**
 * Placeholder error page for client-side routing errors.
 */
export default function ErrorPage(): JSX.Element {
  const error = useRouteError();
  let message = 'An unexpected error occurred.';

  if (isRouteErrorResponse(error)) {
    // React Router error response (404, 401, etc.)
    message = `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    // JS error
    message = error.message;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Oops!</h1>
        <p className="text-gray-700 mb-6">{message}</p>
        <Link
          to="/"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
