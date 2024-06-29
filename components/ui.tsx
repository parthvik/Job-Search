import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function Ui() {
  return (
    <div className="p-6 bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 min-h-screen">
      <div className="max-w-7xl mx-auto bg-[#F3F4F6] rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search people"
              className="border border-gray-300 rounded-md p-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-600">Experience</span>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                defaultValue="0"
                className="w-full md:w-64"
                onChange={(e) => {
                  const value = e.target.value;
                  const experienceValueElement = document.getElementById('experienceValue');
                  if (experienceValueElement) {
                    experienceValueElement.innerText = `${value}+ years`;
                  }
                }}
              />
              <span id="experienceValue" className="font-semibold text-gray-800">0+ years</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-600">Budget</span>
              <input
                type="range"
                min="1000"
                max="10000"
                step="100"
                defaultValue="10000"
                className="w-full md:w-64"
                onChange={(e) => {
                  const value = e.target.value;
                  const budgetValueElement = document.getElementById('budgetValue');
                  if (budgetValueElement) {
                    budgetValueElement.innerText = `$${value}${value === '10000' ? '+' : ''}`;
                  }
                }}
              />
              <span id="budgetValue" className="font-semibold text-gray-800">$10,000+</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-600 mb-2">Availability</span>
              <div className="relative">
                <input
                  type="date"
                  className="border border-gray-300 rounded-md p-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-purple-500 gardio"
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    const value = e.target.value;
                    const availabilityValueElement = document.getElementById('availabilityValue');
                    if (availabilityValueElement) {
                      availabilityValueElement.innerText = `Starts on ${value}`;
                    }
                  }}
                />
              </div>
              <span id="availabilityValue" className="font-semibold text-gray-800 mt-2">Starts on 07/29</span>
            </div>
            <button className="p-2 bg-purple-300 text-white rounded-full hover:bg-purple-400">
              <SearchIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <Badge variant="default" className="bg-gray-200 text-gray-800">
            Worked on web scraping
          </Badge>
          <Badge variant="default" className="bg-gray-200 text-gray-800">
            Lives in South America
          </Badge>
          <Badge variant="default" className="bg-gray-200 text-gray-800">
            Worked at Amazon
          </Badge>
          <Badge variant="default" className="bg-gray-200 text-gray-800">
            Fine-tuned on LLMs
          </Badge>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <Card className="border border-gray-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white hover:border-purple-300">
            <CardHeader className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>KS</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-gray-800">Kavish Sanghvi | Exp: 3 years | United States</CardTitle>
                <CardDescription className="text-gray-600">
                  Enhanced trading platforms and led critical projects at JP Morgan and Amazon.
                </CardDescription>
              </div>
              <Button variant="default" className="ml-auto text-purple-600 hover:bg-purple-300">
                View profile <ArrowRightIcon className="ml-2 w-4 h-4 text-purple-600" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mt-2">
                <p className="font-semibold text-gray-800">Expert in</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="default" className="bg-gray-200 text-gray-800">
                    Java
                  </Badge>
                  <Badge variant="default" className="bg-gray-200 text-gray-800">
                    Spring
                  </Badge>
                  <Badge variant="default" className="bg-gray-200 text-gray-800">
                    Agile
                  </Badge>
                  <Badge variant="default" className="bg-gray-200 text-gray-800">
                    AWS
                  </Badge>
                  <Badge variant="default" className="bg-gray-200 text-gray-800">
                    SQL
                  </Badge>
                </div>
              </div>
              <div className="mt-4">
                <p className="font-semibold text-gray-800">Commitment</p>
                <Badge variant="default" className="bg-gray-200 text-gray-800">
                  Full-time
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white hover:border-purple-300">
            <CardHeader className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>SS</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-gray-800">Swapnil Shivhare | Exp: 17 years</CardTitle>
                <CardDescription className="text-gray-600">
                  Led backend development for Walmart's Spark App using Java, Spring Boot, Kafka.
                </CardDescription>
              </div>
              <Button variant="default" className="ml-auto text-purple-600 hover:bg-purple-300">
                View profile <ArrowRightIcon className="ml-2 w-4 h-4 text-purple-600" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mt-2">
                <p className="font-semibold text-gray-800">Expert in</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="default" className="bg-gray-200 text-gray-800">
                    Java
                  </Badge>
                  <Badge variant="default" className="bg-gray-200 text-gray-800">
                    Spring
                  </Badge>
                  <Badge variant="default" className="bg-gray-200 text-gray-800">
                    C++
                  </Badge>
                  <Badge variant="default" className="bg-gray-200 text-gray-800">
                    Docker
                  </Badge>
                  <Badge variant="default" className="bg-gray-200 text-gray-800">
                    SQL
                  </Badge>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <p className="font-semibold text-gray-800">Commitment</p>
                <Badge variant="default" className="bg-gray-200 text-gray-800">
                  Full-time
                </Badge>
                <Badge variant="default" className="bg-gray-200 text-gray-800">
                  Part-time
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white hover:border-purple-300">
            <CardHeader className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>RD</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-gray-800">Rajib Dutta | Exp: 14 years | India</CardTitle>
                <CardDescription className="text-gray-600">
                  Developed TCP acceleration solutions as Principal at Enea Openwave and Oracle.
                </CardDescription>
              </div>
              <Button variant="default" className="ml-auto text-purple-600 hover:bg-purple-300">
                View profile <ArrowRightIcon className="ml-2 w-4 h-4 text-purple-600" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mt-2">
                <p className="font-semibold text-gray-800">Expert in</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="default" className="bg-gray-200 text-gray-800">
                    C
                  </Badge>
                  <Badge variant="default" className="bg-gray-200 text-gray-800">
                    Project Management
                  </Badge>
                  <Badge variant="default" className="bg-gray-200 text-gray-800">
                    Machine Learning
                  </Badge>
                  <Badge variant="default" className="bg-gray-200 text-gray-800">
                    SQL
                  </Badge>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <p className="font-semibold text-gray-800">Commitment</p>
                <Badge variant="default" className="bg-gray-200 text-gray-800">
                  Full-time
                </Badge>
                <Badge variant="default" className="bg-gray-200 text-gray-800">
                  Part-time
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white hover:border-purple-300">
            <CardHeader className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>AK</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-gray-800">Aashish Kumar | Exp: 6 years | United States</CardTitle>
                <CardDescription className="text-gray-600">
                  Led Google Assistant backend migration, impacting 150M users with zero downtime.
                </CardDescription>
              </div>
              <Button variant="default" className="ml-auto text-purple-600 hover:bg-purple-300">
                View profile <ArrowRightIcon className="ml-2 w-4 h-4 text-purple-600" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mt-2">
                <p className="font-semibold text-gray-800">Expert in</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="default" className="bg-gray-200 text-gray-800">
                    Java
                  </Badge>
                  <Badge variant="default" className="bg-gray-200 text-gray-800">
                    Python
                  </Badge>
                  <Badge variant="default" className="bg-gray-200 text-gray-800">
                    SQL
                  </Badge>
                  <Badge variant="default" className="bg-gray-200 text-gray-800">
                    JavaScript
                  </Badge>
                  <Badge variant="default" className="bg-gray-200 text-gray-800">
                    AWS
                  </Badge>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <p className="font-semibold text-gray-800">Commitment</p>
                <Badge variant="default" className="bg-gray-200 text-gray-800">
                  Full-time
                </Badge>
                <Badge variant="default" className="bg-gray-200 text-gray-800">
                  Part-time
                </Badge>
              </div>
            </CardContent>
          </Card>
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

function BadgeInfoIcon(props: any) {
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
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <line x1="12" x2="12" y1="16" y2="12" />
      <line x1="12" x2="12.01" y1="8" y2="8" />
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
