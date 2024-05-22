'use client'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Card, CardContent, CardHeader, CardFooter } from './ui/card'

export default function Modal({deal}) {
  
return (  
<Dialog>
<DialogTrigger className="font-medium">                    
    {deal.companyName}
</DialogTrigger>
<DialogContent style={{ maxHeight: '80vh', overflowY: 'auto' }}>
  <DialogHeader>
    <DialogTitle>{deal.opportunityName}</DialogTitle>
        <Card>
            <CardHeader className="font-medium">Details</CardHeader>
            <CardContent>
                <p>Stage: {deal?.dealStage ?? 'NA'}</p>
                <p>Amount: ${deal?.amount?.toLocaleString() ?? 'NA'}</p>
                <p>First Contact: {deal?.firstContact?.split('T')[0] ?? 'NA'}</p>
                <p>Close Date: {deal?.closeDate?.split('T')[0] ?? 'NA'}</p>
                <p>Account Owner: {deal?.accountOwner ?? 'NA'}</p>
                <p>Contacts: {deal?.contactNames?.join(', ') ?? 'NA'}</p>
            </CardContent>
        </Card>
        <Card className="mt-4">
            <CardHeader className="font-medium">{`${deal.notes.length} Note${deal.notes.length > 1 ? 's' : ''} Available`}</CardHeader>
            <CardContent>
                {deal.notes.map((note, index) => (
                    <Card key={`note-${index}`} className="mb-2">
                        <CardContent className="mt-4">
                            <p>{note.note}</p>
                        </CardContent>
                        <CardFooter>
                        <p>{note.date?.split('T')[0]} by {note.person}</p>
                        </CardFooter>
                    </Card>
                ))}
            </CardContent>
        </Card>
    <DialogDescription>
    </DialogDescription>
</DialogHeader>
</DialogContent>
</Dialog>
)
}
