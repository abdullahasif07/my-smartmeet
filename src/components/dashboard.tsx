import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Link } from "react-router-dom"

export function Dashboard() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
        <nav className="flex-col hidden gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link className="flex items-center gap-2 text-lg font-semibold md:text-base" to="#">
            <Package2Icon className="w-6 h-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <Link className="text-gray-500 dark:text-gray-400" to="#">
            Home
          </Link>
          <Link className="font-bold" to="#">
            Meetings
          </Link>
          <Link className="text-gray-500 dark:text-gray-400" to="#">
            Recordings
          </Link>
        </nav>
        <div className="flex items-center w-full gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="flex-1 ml-auto sm:flex-initial">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                placeholder="Search meetings..."
                type="search"
              />
            </div>
          </form>
          <Button className="rounded-full" size="icon" variant="ghost">
            <img
              alt="Avatar"
              className="rounded-full"
              height="32"
              src="/placeholder.svg"
              style={{
                aspectRatio: "32/32",
                objectFit: "cover",
              }}
              width="32"
            />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col p-4 md:p-10">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Create a new meeting</CardTitle>
              <CardDescription>Schedule a new meeting and invite participants</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <Label className="text-sm" htmlFor="title">
                    Meeting Title
                  </Label>
                  <Input id="title" placeholder="Enter title" />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-sm" htmlFor="date">
                    Date
                  </Label>
                  <Input id="date" type="date" />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-sm" htmlFor="time">
                    Time
                  </Label>
                  <Input id="time" type="time" />
                </div>
                <div className="flex flex-col col-start-1 col-span-2 gap-1">
                  <Label className="text-sm" htmlFor="participants">
                    Participants
                  </Label>
                  <Textarea className="min-h-[100px]" id="participants" placeholder="Enter email addresses" />
                </div>
              </form>
              <Button className="mt-4">Create Meeting</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Join a meeting</CardTitle>
              <CardDescription>Enter a meeting code to join an existing meeting</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <Label className="text-sm" htmlFor="code">
                    Meeting Code
                  </Label>
                  <Input id="code" placeholder="Enter code" />
                </div>
                <Button type="submit">Join Meeting</Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Upcoming Meetings</CardTitle>
              <CardDescription>You have no upcoming meetings scheduled</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">You have no upcoming meetings scheduled</p>
                <Button size="sm">Schedule a meeting</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}


function Package2Icon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  )
}


function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
