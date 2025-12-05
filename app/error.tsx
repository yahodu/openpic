'use client'

import { Button } from '@/components/ui/button'

const ErrorPage = ({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) => {
    return (
        <div className='grid min-h-screen grid-cols-1 lg:grid-cols-2'>
            <div className='flex flex-col items-center justify-center px-4 py-8 text-center'>
                <h2 className='mb-6 text-5xl font-semibold'>Whoops!</h2>
                <h3 className='mb-1.5 text-3xl font-semibold'>Something went wrong</h3>
                <p className='text-muted-foreground mb-6 max-w-sm'>
                    An unexpected error occurred. We suggest you try again or go back to home.
                </p>
                <div className='flex gap-3'>
                    <Button onClick={reset} size='lg' className='rounded-lg text-base'>
                        Try again
                    </Button>
                    <Button asChild size='lg' variant='outline' className='rounded-lg text-base'>
                        <a href='/'>Back to home</a>
                    </Button>
                </div>
            </div>
            {/* Right Section: Illustration */}
            <div className='relative max-h-screen w-full p-2 max-lg:hidden'>
                <div className='h-full w-full rounded-2xl bg-black'></div>
                <img
                    src='https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/error/image-1.png'
                    alt='Error illustration'
                    className='absolute top-1/2 left-1/2 h-[clamp(260px,25vw,406px)] -translate-x-1/2 -translate-y-1/2'
                />
            </div>
        </div>
    )
}

export default ErrorPage