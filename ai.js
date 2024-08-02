require('dotenv').config();
const { OpenAIApi, Configuration } = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function main() {
    try {
        const response = await openai.createChatCompletion({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: "Say this is a test" }],
            stream: false, // Change to true if you need streaming
        });

        if (response.data.choices && response.data.choices.length > 0) {
            console.log(response.data.choices[0].message.content);
        }
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}

main();
