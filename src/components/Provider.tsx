'use client'

import {QueryClient, QueryClientProvider} from "@tanstack/react-query"

type Props = {
    children: React.ReactNode
}

const queyClient = new QueryClient()

export default ({children}: Props) => 
{
    return (
        <QueryClientProvider client={queyClient}>
            {children}
        </QueryClientProvider>
    )
}    
