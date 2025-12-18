import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/lib/api";

import { useSearchParams, useRouter } from "next/navigation";
import { useDebounce } from "../hooks/useDebounce";
import { User, UsersResponse } from "../types/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
export default function UsersList() {
  const router = useRouter();
  const params = useSearchParams();

  const page = Number(params.get("page") || 1);
  const limit = 10;
  const search = params.get("search") || "";
  const gender = params.get("gender") || "";

  const debouncedSearch = useDebounce(search, 600);
  const { data, isLoading, refetch } = useQuery<UsersResponse>({
    queryKey: ["users", page, debouncedSearch, gender],
    queryFn: () =>
      fetchUsers({
        page,
        limit,
        search: debouncedSearch,
        gender,
      }),
    initialData: {
      users: [],
      total: 0,
      skip: 0,
      limit,
    },
    placeholderData: (prev) => prev,
  });

  function updateParam(key: string, value: string) {
    const newParams = new URLSearchParams(params.toString());
    newParams.set(key, value);
    if (key !== "page") newParams.set("page", "1");
    router.push(`?${newParams.toString()}`);
  }

  function goToPage(p: number) {
    updateParam("page", String(p));
  }

  const totalPages = Math.ceil(data.total / limit);

  if (isLoading) return <p className="text-white">Loading users...</p>;

  return (
    <div className="text-white flex flex-col gap-5">
      <h1>Users</h1>
      <div className="flex gap-4">
        <Input
          placeholder="Search user"
          value={search}
          onChange={(e) => updateParam("search", e.target.value)}
        />

        <Select
          value={gender}
          onValueChange={(value) => updateParam("gender", value)}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Select a gender" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800">
            <SelectGroup className="bg-slate-800 text-white">
              <SelectLabel>Select Gender</SelectLabel>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          size="sm"
          variant="outline"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </div>
      <div className="border border-gray-400 rounded-md">
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead className="w-25 text-white">UserName</TableHead>
              <TableHead className="text-white">Gender</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white ">Eye Color</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.users.length > 0 ? (
              data.users.map((d: User) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.username}</TableCell>
                  <TableCell>{d.gender}</TableCell>
                  <TableCell>{d.email}</TableCell>
                  <TableCell>{d.eyeColor}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-white">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        <Button
          size="sm"
          variant="outline"
          disabled={page === 1}
          onClick={() => goToPage(page - 1)}
          className="bg-slate-700"
        >
          Prev
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            size="sm"
            variant={p === page ? "secondary" : "default"}
            disabled={p === page}
            onClick={() => goToPage(p)}
          >
            {p}
          </Button>
        ))}

        <Button
          size="sm"
          variant="outline"
          disabled={page === totalPages}
          onClick={() => goToPage(page + 1)}
          className="bg-slate-700"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
