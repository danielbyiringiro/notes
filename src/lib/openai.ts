import {Configuration, OpenAIApi} from "openai-edge";

const Config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(Config);

export async function generateImagePrompt(name:string)
{
    try
    {
        const response = await openai.createChatCompletion({
            'model': 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a creative and helpful AI assistant capable of generating interesting thumbnail descriptions for my notes. Your output will be fed into the DALL-E API to generate a thumbnail. The description should be minimalistic and flat style',
                },
                {
                    role: 'user',
                    content: `Please generate a thumbnail for my notebook titled ${name}`,
                }
            ],
        });

        const data = await response.json();

        if (data && data.choices && data.choices.length > 0)
        {
            const image_description = data.choices[0].message.content;
            return image_description as string;
        }
        else
        {
            throw new Error("Failed to generate image description");
        }
    }
    catch (error)
    {
        console.error("Error generating image prompt:", error);
        throw new Error(`Failed to generate image prompt: ${error}`);
    }
}

export async function generateImage(image_description:string)
{
    try
    {
        const response = await openai.createImage({
            prompt: image_description,
            n: 1,
            size: '256x256'
        });
        const data = await response.json();
        const image_url = data.data[0].url;
        return image_url as string;

    }
    catch (error)
    {
        console.error("Error generating image:", error);
        throw new Error(`Failed to generate image: ${error}`);
    }
}