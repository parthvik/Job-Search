import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";

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
  const [users, setUsers] = useState([]);
  const [executionTime, setExecutionTime] = useState(0);

  const handleSearch = async (searchResponse: string) => {
    const info = {
      budget,
      experience,
      startDate,
      workType: "both",
      semanticSearchString: searchResponse
    };

    const response = await fetch("http://localhost:8000/query-jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(info),
    });

    const result = await response.json();
    setData(result); // Store the entire result for potential additional use
    setUsers(result.users); // Store only the users array
    setExecutionTime(result.execution_time); // Store the execution time
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
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search people"
              className="border border-gray-300 rounded-md p-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-600"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex flex-col items-center">
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
            <div className="flex flex-col items-center">
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
            <div className="flex flex-col items-center">
              <span className="text-sm text-red-600 mb-2">Availability</span>
              <div className="relative">
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
            <button
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
              onClick={() => handleSearch(searchString)}
            >
              <SearchIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <Badge variant="default" className="bg-gray-200 text-gray-800" onClick={() => handleSearch("Worked on web scraping")}>
            Worked on web scraping
          </Badge>
          <Badge variant="default" className="bg-gray-200 text-gray-800" onClick={() => handleSearch("Lives in South America")}>
            Lives in South America
          </Badge>
          <Badge variant="default" className="bg-gray-200 text-gray-800" onClick={() => handleSearch("Worked at Amazon")}>
            Worked at Amazon
          </Badge>
          <Badge variant="default" className="bg-gray-200 text-gray-800" onClick={() => handleSearch("Fine-tuned on LLMs")}>
            Fine-tuned on LLMs
          </Badge>
        </div>
        <div className="mt-6 flex space-x-4">
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
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {users.map((user) => (
            <Card key={user.user_id} className="border border-gray-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white hover:border-purple-300">
              <CardHeader className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={`https://randomuser.me/api/portraits/men/${user.user_id}.jpg`} className="rounded-full" />
                  <AvatarFallback>{user.name.split(" ")[0][0] + user.name.split(" ")[1][0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-gray-800">{`${user.name} | Exp: ${user.total_experience_years} years`}</CardTitle>
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




