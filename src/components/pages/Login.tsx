import { useLoginForm } from "../../services/helpers";
import Button from "../common/Button";
import Input from "../common/Input";

export default function Login() {
  const { form, error, handleChange, handleSubmit } = useLoginForm();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0E1217] text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 p-6 rounded bg-zinc-900 border border-zinc-700"
      >
        <h2 className="text-2xl font-bold text-[#A8B3CF]">🔐 Login</h2>

        <Input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 text-white"
        />
        <Input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 text-white"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button
          type="submit"
          className="w-full bg-white text-black py-2 rounded hover:bg-gray-200"
        >
          Login
        </Button>
      </form>
    </div>
  );
}
