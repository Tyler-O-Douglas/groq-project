"use client"
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useState } from 'react';
import { chatBot } from '@/lib/actions/text-search'
import AudioRecorder from './recorder'
import { ReloadIcon } from "@radix-ui/react-icons"


export default function Search({data}) {

    const [searchTerm, setSearchTerm] = useState('')
    const [searches, setSearches] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [submitting, setSubmitting] = useState(false)

    function clearHistory() {
        setSearches([]);
        setSearchResults([]);
    }

    async function onSearch() {
        setSubmitting(() => true);
        const response = await chatBot(searchTerm, searches, searchResults, data);
        setSearches([...searches, searchTerm]);
        setSearchResults([...searchResults, response]);
        setSearchTerm('');
        setSubmitting(() => false);
        }

    return (
    <Card className="mb-8">
    <CardHeader className="items-center">
        <h2 className="text-xl font-bold">To ask questions use the search bar.</h2>
        <h3 className="text-lg font-medium">To create a sales lead, change or delete data, please record a note</h3>
        <h4 className="text-md font-small">Click on a deal name in the table to see more information about it</h4>
    </CardHeader>
    <CardContent className="flex items-center gap-4 py-4">
        <AudioRecorder />
    <div className="flex w-full items-center space-x-2">
      <Input 
        type="search" 
        placeholder="Ask a question..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} />
      <Button type="submit" onClick={onSearch}>{submitting ? <ReloadIcon className="h-6 w-6 animate-spin" /> : 'Search'}</Button>
    </div>
        {searches.length > 0 && (<Button onClick={clearHistory} variant="secondary">
            Clear Chat History
        </Button>)}
    </CardContent>
    <CardFooter>
        <ul className="flex-col items-start justify-start space-y-4">
        {searches.map((search, index) => (
            <>
            <li key={`search-${index}`}>
                <span className='text-medium font-bold'>{`Question ${index + 1}`}:</span> {search}
            </li>
            {searchResults[index] && (
                <li key={`search-result-${index}`}>
                    <span className='text-medium font-bold'>{`Answer ${index + 1}`}:</span> {searchResults[index]}
                </li>
            )}
            </>
        ))}
        </ul>
    </CardFooter>
  </Card>
    )

}
