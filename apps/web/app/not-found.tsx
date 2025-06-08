export default function NotFound() {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-black">404</h1>
          <p className="text-2xl mt-4 text-gray-800">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="mt-2 text-gray-600">
            It looks like the property or page you're searching for isn't here.
          </p>
  
          <div className="mt-6">
            <a
              href="/"
              className="px-6 py-3 text-white bg-blue-600 hover:bg-black-700 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back to Home
            </a>
          </div>
        </div>
  
        <div className="mt-10 max-w-lg p-4">
          <img
            src="/images/logo.png" // Add a custom SVG or image related to real estate in this path
            alt="Not Found Illustration"
            className="w-full"
          />
        </div>
      </div>
    );
  }
  