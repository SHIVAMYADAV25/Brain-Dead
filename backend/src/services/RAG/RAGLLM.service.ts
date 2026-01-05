import { geminiLLM } from "../../utils/LLM.utils.js";

export async function RAGLLM(context:string,query:string) {
    // const response = await OpenAILLM.responses.create({
    //     model : "gemini-2.5-flash-lite",
    //     input : [
    //         {
    //             role : "developer",
    //             content : `you are an expert in taking context and answering depending on this is the ${context}`
    //         },{
    //             role : "user",
    //             content : query
    //         }
    //     ]
    // })

    const model = geminiLLM.getGenerativeModel({
          model: "gemini-2.5-flash-lite"
        });
    
        const prompt = `
            you are an expert in taking context and answering depending on this is the ${context}

            and this is the query provided by user ${query}
        `;
    
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        console.log("summary : ",response);

    return response
}