import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Home = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get(
        "https://thundering-sheeree-muhammadayubiy-2a80f5fe.koyeb.app/api/users/",
        { withCredentials: true }
      );
      return res.data;
    },
  });

  if (isLoading) return <p>⏳ Loading...</p>;
  if (error) return <p>❌ Error: {error.message}</p>;

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">📄 Posts</h1>
      <ul className="space-y-2">
        {data.slice(0, 5).map((item, index) => (
          <li key={index} className="p-4 border rounded shadow">
            <h2 className="font-semibold">{item.fullName}</h2>
            <p>{item.email}</p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Home;
