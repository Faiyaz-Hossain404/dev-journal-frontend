import { useLoginForm } from "../../services/helpers";
import Button from "../common/Button";
import Input from "../common/Input";

export default function Login() {
  const { form, error, handleChange, handleSubmit } = useLoginForm();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0E1217] text-white px-4">
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-zinc-700 to-zinc-900 opacity-40 blur"></div>

        <form
          onSubmit={handleSubmit}
          className="relative space-y-6 p-8 rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl"
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-[#A8B3CF]">Welcome back</h2>
            <p className="text-sm text-gray-400">
              Sign in to continue to Dev Journal
            </p>
          </div>

          <div className="space-y-4">
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 focus:border-white focus:ring-1 focus:ring-white transition"
            />
            <Input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 focus:border-white focus:ring-1 focus:ring-white transition"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button
            type="submit"
            className="w-full py-3 rounded-lg bg-white text-black font-semibold tracking-wide hover:scale-[1.02] hover:bg-gray-200 transition-transform cursor-pointer"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
