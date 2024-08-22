// import { exec } from "child_process";
// import cors from "cors";
// import dotenv from "dotenv";
// import voice from "elevenlabs-node";
// import express from "express";
// import { promises as fs } from "fs";
// import axios from "axios";
// // import OpenAI from "openai";
// const url = "https://www.llama2.ai/api";
// const headers = {
//     "Content-Type": "text/plain;charset=UTF-8",
//     "User-Agent":
//         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
// };
// dotenv.config();

// // const openai = new OpenAI({
// //     apiKey: process.env.OPENAI_API_KEY || "-", // Your OpenAI API key here, I used "-" to avoid errors when the key is not set but you should not do that
// // });

// const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;
// const voiceID = "Xb7hH8MSUJpSbSDYk0k2";

// const app = express();
// app.use(express.json());
// app.use(cors());
// const port = 3000;

// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });

// app.get("/voices", async (req, res) => {
//     res.send(await voice.getVoices(elevenLabsApiKey));
// });

// const execCommand = (command) => {
//     return new Promise((resolve, reject) => {
//         exec(command, (error, stdout, stderr) => {
//             if (error) reject(error);
//             resolve(stdout);
//         });
//     });
// };

// const lipSyncMessage = async (message) => {
//     const time = new Date().getTime();
//     console.log(`Starting conversion for message ${message}`);
//     await execCommand(
//         `ffmpeg -y -i audios/message_${message}.mp3 audios/message_${message}.wav`
//         // -y to overwrite the file
//     );
//     console.log(`Conversion done in ${new Date().getTime() - time}ms`);
//     // await execCommand(
//     //     `.\bin\rhubarb.exe -f json -o "audios\message_${message}.json" "audios\message_${message}.wav" -r phonetic`
//     // );
//     await execCommand(
//         `.\\bin\\rhubarb\\rhubarb.exe -f json -o "audios\\message_${message}.json" "audios\\message_${message}.wav" -r phonetic`
//     );

//     // -r phonetic is faster but less accurate
//     console.log(`Lip sync done in ${new Date().getTime() - time}ms`);
// };

// app.post("/chat", async (req, res) => {
//     const userMessage = req.body.message;
//     if (!userMessage) {
//         res.send({
//             messages: [
//                 {
//                     text: "Hey dear... How was your day?",
//                     audio: await audioFileToBase64("audios/intro_0.wav"),
//                     lipsync: await readJsonTranscript("audios/intro_0.json"),
//                     facialExpression: "smile",
//                     animation: "Talking_1",
//                 },
//             ],
//         });
//         return;
//     }
//     if (!elevenLabsApiKey || openai.apiKey === "-") {
//         res.send({
//             messages: [
//                 {
//                     text: "Please my dear, don't forget to add your API keys!",
//                     audio: await audioFileToBase64("audios/api_0.wav"),
//                     lipsync: await readJsonTranscript("audios/api_0.json"),
//                     facialExpression: "angry",
//                     animation: "Angry",
//                 },
//                 {
//                     text: "You don't want to ruin Wawa Sensei with a crazy ChatGPT and ElevenLabs bill, right?",
//                     audio: await audioFileToBase64("audios/api_1.wav"),
//                     lipsync: await readJsonTranscript("audios/api_1.json"),
//                     facialExpression: "smile",
//                     animation: "Laughing",
//                 },
//             ],
//         });
//         return;
//     }

//     // const completion = await openai.chat.completions.create({
//     //     model: "gpt-3.5-turbo-1106",
//     //     max_tokens: 1000,
//     //     temperature: 0.6,
//     //     response_format: {
//     //         type: "json_object",
//     //     },
//     //     messages: [
//     //         {
//     //             role: "system",
//     //             content: `
//     //     You are a virtual girlfriend.
//     //     You will always reply with a JSON array of messages. With a maximum of 3 messages.
//     //     Each message has a text, facialExpression, and animation property.
//     //     The different facial expressions are: smile, sad, angry, surprised, funnyFace, and default.
//     //     The different animations are: Talking_0, Talking_1, Talking_2, Crying, Laughing, Rumba, Idle, Terrified, and Angry.
//     //     `,
//     //         },
//     //         {
//     //             role: "user",
//     //             content: userMessage || "Hello",
//     //         },
//     //     ],
//     // });
//     let messages = JSON.parse(completion.choices[0].message.content);
//     if (messages.messages) {
//         messages = messages.messages; // ChatGPT is not 100% reliable, sometimes it directly returns an array and sometimes a JSON object with a messages property
//     }
//     for (let i = 0; i < messages.length; i++) {
//         const message = messages[i];
//         // generate audio file
//         const fileName = `audios/message_${i}.mp3`; // The name of your audio file
//         const textInput = message.text; // The text you wish to convert to speech
//         await voice.textToSpeech(
//             elevenLabsApiKey,
//             voiceID,
//             fileName,
//             textInput
//         );
//         // generate lipsync
//         await lipSyncMessage(i);
//         message.audio = await audioFileToBase64(fileName);
//         message.lipsync = await readJsonTranscript(`audios/message_${i}.json`);
//     }

//     res.send({ messages });
// });

// const readJsonTranscript = async (file) => {
//     const data = await fs.readFile(file, "utf8");
//     return JSON.parse(data);
// };

// const audioFileToBase64 = async (file) => {
//     const data = await fs.readFile(file);
//     return data.toString("base64");
// };

// app.listen(port, () => {
//     console.log(`Virtual Girlfriend listening on port ${port}`);
// });

import { exec } from "child_process";
import cors from "cors";
import dotenv from "dotenv";
import voice from "elevenlabs-node";
import express from "express";
import { promises as fs } from "fs";
import axios from "axios";

dotenv.config();

const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;
const voiceID = "Xb7hH8MSUJpSbSDYk0k2";
const port = 3000;

// LLaMA 2 API configuration
const llamaApiUrl = "https://www.llama2.ai/api";
const llamaHeaders = {
    "Content-Type": "application/json",
    "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
};

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/voices", async (req, res) => {
    res.send(await voice.getVoices(elevenLabsApiKey));
});

const execCommand = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) reject(error);
            resolve(stdout);
        });
    });
};

const lipSyncMessage = async (message) => {
    const time = new Date().getTime();
    console.log(`Starting conversion for message ${message}`);
    await execCommand(
        `ffmpeg -y -i audios/message_${message}.mp3 audios/message_${message}.wav`
    );
    console.log(`Conversion done in ${new Date().getTime() - time}ms`);
    await execCommand(
        `.\\bin\\rhubarb\\rhubarb.exe -f json -o "audios\\message_${message}.json" "audios\\message_${message}.wav" -r phonetic`
    );
    console.log(`Lip sync done in ${new Date().getTime() - time}ms`);
};

//     const userMessage = req.body.message;
//     if (!userMessage) {
//         res.send({
//             messages: [
//                 {
//                     text: "Hey dear... How was your day?",
//                     audio: await audioFileToBase64("audios/intro_0.wav"),
//                     lipsync: await readJsonTranscript("audios/intro_0.json"),
//                     facialExpression: "smile",
//                     animation: "Talking_1",
//                 },
//             ],
//         });
//         return;
//     }
//     if (!elevenLabsApiKey) {
//         res.send({
//             messages: [
//                 {
//                     text: "Please my dear, don't forget to add your API keys!",
//                     audio: await audioFileToBase64("audios/api_0.wav"),
//                     lipsync: await readJsonTranscript("audios/api_0.json"),
//                     facialExpression: "angry",
//                     animation: "Angry",
//                 },
//                 {
//                     text: "You don't want to ruin Wawa Sensei with a crazy ChatGPT and ElevenLabs bill, right?",
//                     audio: await audioFileToBase64("audios/api_1.wav"),
//                     lipsync: await readJsonTranscript("audios/api_1.json"),
//                     facialExpression: "smile",
//                     animation: "Laughing",
//                 },
//             ],
//         });
//         return;
//     }

//     // LLaMA 2 API request
//     const prompt = userMessage || "Hello";
//     const body = JSON.stringify({
//         prompt: `<s>[INST] <<SYS>>\nYou are a helpful assistant.\n<</SYS>>\n\n ${prompt} [/INST]\n`,
//         model: "meta/llama-2-70b-chat",
//         systemPrompt: "You are a very assistant.",
//         temperature: 0.75,
//         topP: 0.9,
//         maxTokens: 1024,
//         image: null,
//         audio: null,
//     });

//     let messages = [];
//     try {
//         const response = await axios.post(llamaApiUrl, body, {
//             headers: llamaHeaders,
//         });
//         messages = JSON.parse(response.data); // Adjust based on actual response structure
//     } catch (error) {
//         console.error("Error fetching from LLaMA 2 API:", error.message);
//         res.status(500).send({
//             error: "Error fetching response from LLaMA 2 API",
//         });
//         return;
//     }

//     // Process messages
//     for (let i = 0; i < messages.length; i++) {
//         const message = messages[i];
//         const fileName = `audios/message_${i}.mp3`;
//         const textInput = message.text;
//         await voice.textToSpeech(
//             elevenLabsApiKey,
//             voiceID,
//             fileName,
//             textInput
//         );
//         await lipSyncMessage(i);
//         message.audio = await audioFileToBase64(fileName);
//         message.lipsync = await readJsonTranscript(`audios/message_${i}.json`);
//     }

//     res.send({ messages });
// });

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) {
        res.send({
            messages: [
                {
                    text: "Hey dear... How was your day?",
                    audio: await audioFileToBase64("audios/intro_0.wav"),
                    lipsync: await readJsonTranscript("audios/intro_0.json"),
                    facialExpression: "smile",
                    animation: "Talking_1",
                },
            ],
        });
        return;
    }
    if (!elevenLabsApiKey) {
        res.send({
            messages: [
                {
                    text: "Please my dear, don't forget to add your API keys!",
                    audio: await audioFileToBase64("audios/api_0.wav"),
                    lipsync: await readJsonTranscript("audios/api_0.json"),
                    facialExpression: "angry",
                    animation: "Angry",
                },
                {
                    text: "You don't want to ruin Wawa Sensei with a crazy ChatGPT and ElevenLabs bill, right?",
                    audio: await audioFileToBase64("audios/api_1.wav"),
                    lipsync: await readJsonTranscript("audios/api_1.json"),
                    facialExpression: "smile",
                    animation: "Laughing",
                },
            ],
        });
        return;
    }

    // LLaMA 2 API request
    const prompt = userMessage || "Hello";
    const body = JSON.stringify({
        prompt: `<s>[INST] <<SYS>>\nYou are a helpful assistant.\n<</SYS>>\n\n ${prompt} [/INST]\n`,
        model: "meta/llama-2-70b-chat",
        systemPrompt: "You are a very assistant.",
        temperature: 0.75,
        topP: 0.9,
        maxTokens: 1024,
        image: null,
        audio: null,
    });

    try {
        const response = await axios.post(llamaApiUrl, body, {
            headers: llamaHeaders,
        });
        console.log("Raw response data:", response.data);

        // Assuming the response is plain text
        const responseText = response.data.trim();
        const messages = [{ text: responseText }];

        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            const fileName = `audios/message_${i}.mp3`;
            const textInput = message.text;

            // Convert text to speech
            await voice.textToSpeech(
                elevenLabsApiKey,
                voiceID,
                fileName,
                textInput
            );

            // Generate lip sync data
            await lipSyncMessage(i);

            // Log to verify files and paths
            console.log(
                `Generated files: ${fileName}, audios/message_${i}.json`
            );

            // Read generated audio and lip sync data
            message.audio = await audioFileToBase64(fileName);
            message.lipsync = await readJsonTranscript(
                `audios/message_${i}.json`
            );

            // Debugging output
            console.log(`Message ${i} audio:`, message.audio);
            console.log(`Message ${i} lipsync:`, message.lipsync);
        }

        res.send({ messages });
    } catch (error) {
        console.error("Error fetching from LLaMA 2 API:", error.message);
        res.status(500).send({
            error: "Error fetching response from LLaMA 2 API",
        });
    }
});

const readJsonTranscript = async (file) => {
    const data = await fs.readFile(file, "utf8");
    return JSON.parse(data);
};

const audioFileToBase64 = async (file) => {
    const data = await fs.readFile(file);
    return data.toString("base64");
};

app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
});
