/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/mYMEh57zuPA
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/
import { Button } from "@/components/ui/button"
import { CardContent, Card } from "@/components/ui/card"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Modal from "@/components/deal-modal"
import Search from "@/components/search"
import { getDeals } from "@/lib/mongo/getPostDeals"


export async function Home() {

  const deals = await getDeals();

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="container mx-auto py-4 px-4 md:px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Groq Deals</h1>
          </div>
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 md:px-6">
          <Search data={deals}/>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deal Name</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Likelihood of Close</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>First Contact</TableHead>
                  <TableHead>Close Date</TableHead>
                  <TableHead>Account Owner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {deals.map((deal, index) => (
                <TableRow key={`deal-${index}`}>
                  <TableCell>
                    <Modal deal={deal} />
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {deal.opportunityName}
                    </div>
                  </TableCell>
                  <TableCell>
                    {deal.dealStage == 'won' && (<Badge className="bg-green-100 text-green-800">{deal.dealStage}</Badge>)}
                    {deal.dealStage == 'negotiation' && (<Badge className="bg-yellow-100 text-yellow-800">{deal.dealStage}</Badge>)}
                    {deal.dealStage == 'proposal' && (<Badge className="bg-orange-100 text-orange-800">{deal.dealStage}</Badge>)}
                    {deal.dealStage == 'lost' && (<Badge className="bg-orange-100 text-orange-800">{deal.dealStage}</Badge>)}
                    {deal.dealStage !== 'won' && deal.dealStage !== 'proposal' && deal.dealStage !== 'negotiation' && deal.dealStage !== 'lost' && (<Badge className="bg-red-100 text-red-800">{'NA'}</Badge>)}
                  </TableCell>
                  <TableCell>{deal?.likelihood ? `${deal?.likelihood}%` : 'NA'}</TableCell>
                  <TableCell>{deal?.amount ? `$${deal?.amount?.toLocaleString()}` : 'NA'}</TableCell>
                  <TableCell>{deal?.firstContact?.split('T')[0] ?? 'NA'}</TableCell>
                  <TableCell>{deal?.closeDate?.split('T')[0] ?? 'NA'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarFallback>{deal?.accountOwner?.charAt(0).toUpperCase() ?? 'NA'}</AvatarFallback>
                      </Avatar>
                      {deal?.accountOwner ?? 'NA'}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>
    </div>
  );
}

function BriefcaseIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>)
  );
}


function CheckIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>)
  );
}


function ClockIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>)
  );
}


function DotIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="12.1" cy="12.1" r="1" />
    </svg>)
  );
}


function FilterIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>)
  );
}


function ListIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>)
  );
}
