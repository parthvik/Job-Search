import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";

interface User {
  user_id: string;
  name: string;
  email: string;
  skills: string[];
  full_time_salary: number;
  companies: string[];
  total_experience_years: number;
}

export function Ui() {
  const [experience, setExperience] = useState("0");
  const [budget, setBudget] = useState("0");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchString, setSearchString] = useState("");
  const [commitment, setCommitment] = useState({
    fullTime: true,
    partTime: true,
  });
  const [data, setData] = useState(null);
  const [users, setUsers] = useState<User[]>([]);
  const [executionTime, setExecutionTime] = useState(0);
  const [noResultsMessage, setNoResultsMessage] = useState("");

  const handleSearch = async (searchResponse: string) => {
    const info = {
      budget,
      experience,
      startDate,
      workType: "both",
      semanticSearchString: searchResponse
    };

    try {
      const response = await fetch("https://do0rmamu-mercor-application.hf.space/query-jobs/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.message === "No skills matched your query.") {
        setNoResultsMessage(`No skills matched your query for '${searchResponse}'.`);
        setUsers([]);
        setExecutionTime(0);
        return; // Stop further execution
      } else {
        setData(result); // Store the entire result for potential additional use
        setUsers(result.users); // Store only the users array
        setExecutionTime(result.execution_time); // Store the execution time
        setNoResultsMessage(""); // Clear the no results message
      }
    } catch (error) {
      console.error("Error during search:", error);
      setNoResultsMessage("An error occurred during the search. Please try again later.");
      setUsers([]);
      setExecutionTime(0);
    }
  };

  const toggleCommitment = (type: "fullTime" | "partTime") => {
    setCommitment((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  useEffect(() => {
    const experienceValueElement = document.getElementById('experienceValue');
    const budgetValueElement = document.getElementById('budgetValue');
    const availabilityValueElement = document.getElementById('availabilityValue');

    if (experienceValueElement) {
      experienceValueElement.innerText = `${experience}+ years`;
    }

    if (budgetValueElement) {
      budgetValueElement.innerText = `$${budget}${budget === '10000' ? '+' : ''}`;
    }

    if (availabilityValueElement) {
      availabilityValueElement.innerText = `Starts on ${startDate}`;
    }

    return () => {
      if (experienceValueElement && experienceValueElement.firstChild) {
        experienceValueElement.innerText = "";
      }
      if (budgetValueElement && budgetValueElement.firstChild) {
        budgetValueElement.innerText = "";
      }
      if (availabilityValueElement && availabilityValueElement.firstChild) {
        availabilityValueElement.innerText = "";
      }
    };
  }, [experience, budget, startDate]);

  return (
    <div className="p-6 bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 min-h-screen">
      <div className="max-w-7xl mx-auto bg-[#F3F4F6] rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search people"
              className="border border-gray-300 rounded-md p-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-600"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
            <button
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 flex items-center justify-center"
              onClick={() => handleSearch(searchString)}
            >
              <SearchIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
            <div className="flex flex-col items-center w-full md:w-auto">
              <span className="text-sm text-red-600">Experience</span>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={experience}
                className="w-full md:w-64"
                onChange={(e) => setExperience(e.target.value)}
              />
              <span id="experienceValue" className="font-semibold text-red-600">{experience}+ years</span>
            </div>
            <div className="flex flex-col items-center w-full md:w-auto">
              <span className="text-sm text-red-600">Budget</span>
              <input
                type="range"
                min="1000"
                max="10000"
                step="100"
                value={budget}
                className="w-full md:w-64"
                onChange={(e) => setBudget(e.target.value)}
              />
              <span id="budgetValue" className="font-semibold text-red-600">${budget}{budget === '10000' ? '+' : ''}</span>
            </div>
            <div className="flex flex-col items-center w-full md:w-auto">
              <span className="text-sm text-red-600 mb-2">Availability</span>
              <div className="relative w-full md:w-auto">
                <input
                  type="date"
                  className="border border-red-600 rounded-md p-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-red-600 gardio text-gray-600"
                  min={new Date().toISOString().split("T")[0]}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <span id="availabilityValue" className="font-semibold text-gray-600 mt-2">Starts on {startDate}</span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <Badge variant="default" className="bg-gray-200 text-gray-800" onClick={() => handleSearch("Worked on web-scraping")}>
            Worked on web-scraping
          </Badge>
          <Badge variant="default" className="bg-gray-200 text-gray-800" onClick={() => handleSearch("Python Expert")}>
            Python Expert
          </Badge>
          <Badge variant="default" className="bg-gray-200 text-gray-800" onClick={() => handleSearch("C++")}>
            C++
          </Badge>
          <Badge variant="default" className="bg-gray-200 text-gray-800" onClick={() => handleSearch("AWS")}>
            AWS
          </Badge>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <button
            className={`p-2 rounded-full ${commitment.fullTime ? 'bg-lightblue-300 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => toggleCommitment("fullTime")}
          >
            Full-time
          </button>
          <button
            className={`p-2 rounded-full ${commitment.partTime ? 'bg-lightblue-300 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => toggleCommitment("partTime")}
          >
            Part-time
          </button>
        </div>
        {noResultsMessage && (
          <div className="mt-6 text-red-600 font-semibold">
            {noResultsMessage}
          </div>
        )}
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {users.map((user) => (
            <Card key={user.user_id} className="border border-gray-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white hover:border-purple-300">
              <CardHeader className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={`https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`} className="rounded-full" />
                  <AvatarFallback>{user.name.split(" ")[0][0] + user.name.split(" ")[1][0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-gray-800">{`${user.name} | Exp: ${user.total_experience_years} years`}</CardTitle>
                  <CardDescription className="text-gray-600">{user.email}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-2">
                  <p className="font-semibold text-gray-800">Expert in</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.skills.map(skill => (
                      <Badge key={skill} variant="default" className="bg-gray-200 text-gray-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="font-semibold text-gray-800">Companies</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.companies.map(company => (
                      <Badge key={company} variant="default" className="bg-gray-200 text-gray-800">
                        {company}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="font-semibold text-gray-800">Commitment</p>
                  <Badge variant="default" className="bg-gray-200 text-gray-800">
                    {user.full_time_salary > 4000 ? 'Full-time' : 'Part-time'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function ArrowRightIcon(props: any) {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
