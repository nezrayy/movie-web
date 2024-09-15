import Link from "next/link"

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-[#0C0D11] p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-center text-2xl font-semibold mb-6 text-white">Dramaku</h1>
        <form>
          <div className="mb-4">
            <label className="block text-white">Username</label>
            <input
              type="text"
              className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 text-white"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-6">
            <label className="block text-white">Password</label>
            <input
              type="password"
              className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 text-white"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors mb-4"
          >
            Sign in
          </button>
          <button
            type="button"
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center"
          >
            <img
              src="/google-icon.svg"
              alt="Google Icon"
              className="w-5 h-5 mr-2"
            />
            <span className="text-sm font-medium">Sign in with Google</span>
          </button>
        </form>
        <p className="text-white mt-5 text-center">
          Doesn't have an account? <Link href="/register" className="hover:underline underline-offset-4">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage