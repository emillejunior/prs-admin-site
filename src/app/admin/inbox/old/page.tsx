import {
  CalendarIcon,
  MailIcon,
  PhoneIcon,
  SearchIcon,
  FilterIcon
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { subDays } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function OldInboxPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const search =
    typeof searchParams.search === "string" ? searchParams.search : "";
  const sort =
    typeof searchParams.sort === "string" ? searchParams.sort : "desc";
  const filter =
    typeof searchParams.filter === "string" ? searchParams.filter : "7";

  const filterDate = subDays(new Date(), parseInt(filter));
  const contacts = await prisma.contact.findMany({
    where: {
      createdAt: {
        gte: filterDate
      },
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } }
      ]
    },
    orderBy: {
      createdAt: sort as "asc" | "desc"
    }
  });

  return (
    <div className="container mx-auto space-y-8 p-4">
      <h1 className="mb-8 text-center text-3xl font-bold">
        Old Inbox (Contacts)
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
              <div className="relative flex-grow">
                <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 transform text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search contacts..."
                  name="search"
                  defaultValue={search}
                  className="pl-8"
                />
              </div>
              <Select name="sort" defaultValue={sort}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest first</SelectItem>
                  <SelectItem value="asc">Oldest first</SelectItem>
                </SelectContent>
              </Select>
              <Select name="filter" defaultValue={filter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              <FilterIcon className="mr-2 h-4 w-4" /> Apply Filters
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">
            Showing {contacts.length} contacts in the last {filter} days
          </p>
        </CardFooter>
      </Card>
      <div className="space-y-4">
        {contacts.map((contact) => (
          <Card key={contact.id} className="flex flex-col">
            <CardHeader className="flex-grow">
              <div className="mb-2 flex items-center justify-between">
                <CardTitle className="text-lg">{contact.name}</CardTitle>
                {contact.profession && (
                  <Badge variant="outline">{contact.profession}</Badge>
                )}
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <MailIcon size={14} className="mr-1" />
                  {contact.email}
                </div>
                <div className="flex items-center">
                  <CalendarIcon size={14} className="mr-1" />
                  {contact.createdAt.toDateString()}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {contact.message && (
                <div className="mt-2 rounded-md bg-gray-50 p-3">
                  <p className="text-sm text-gray-700">
                    {contact.message.substring(0, 100)}...
                  </p>
                </div>
              )}
              {contact.phone && (
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <PhoneIcon size={12} className="mr-1" />
                  {contact.phone}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
