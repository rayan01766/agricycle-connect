import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16 pt-20">
          <h1 className="text-6xl font-extrabold text-gray-900 mb-4">
            🌾 AgriCycle Connect
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            Connecting Farmers with Companies to Recycle Agricultural Waste
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/login"
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-lg"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-8 py-3 bg-white text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 font-semibold text-lg"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-4xl mb-4">👨‍🌾</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">For Farmers</h3>
            <p className="text-gray-600">
              List your agricultural waste and connect with companies who need it.
              Turn waste into value.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-4xl mb-4">🏭</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">For Companies</h3>
            <p className="text-gray-600">
              Browse approved listings and find the agricultural waste materials
              your business needs.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-4xl mb-4">♻️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sustainable</h3>
            <p className="text-gray-600">
              Help reduce waste and promote sustainable practices in agriculture
              and industry.
            </p>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h4 className="font-semibold mb-2">Sign Up</h4>
              <p className="text-sm text-gray-600">Create your account as a farmer or company</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h4 className="font-semibold mb-2">List/Browse</h4>
              <p className="text-sm text-gray-600">Farmers list waste, companies browse listings</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h4 className="font-semibold mb-2">Admin Review</h4>
              <p className="text-sm text-gray-600">Listings are reviewed and approved</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">4</span>
              </div>
              <h4 className="font-semibold mb-2">Connect</h4>
              <p className="text-sm text-gray-600">Companies contact farmers directly</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600">
          <p>© 2025 AgriCycle Connect. Building a sustainable future together.</p>
        </div>
      </div>
    </div>
  );
}
