"use client";
import Typewriter from 'typewriter-effect';

type Props = {}

export default (props: Props) =>
{
    return (
        <Typewriter
            options={{
                loop: true,
            }}
            onInit={(typewriter) => {
                typewriter
                .typeString('🚀 Supercharged Productivity')
                .pauseFor(1000).deleteAll()
                .typeString('🤖 AI-Powered Insights.')
                .start();
            }}
        />

    )
}