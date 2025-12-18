export async function fetchUsers({
  page,
  limit,
  search,
  gender,
}: {
  page: number;
  limit: number;
  search: string;
  gender: string;
}) {
  const skip = (page - 1) * limit;

  let url = `https://dummyjson.com/users?limit=${limit}&skip=${skip}`;

  if (search) {
    url = `https://dummyjson.com/users/search?q=${search}&limit=${limit}&skip=${skip}`;
  }

  if (gender) {
    url += `&gender=${gender}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch users");

  return res.json();
}
