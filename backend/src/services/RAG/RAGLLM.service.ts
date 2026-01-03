import { OpenAILLM } from "../../utils/LLM.utils.js";

export async function RAGLLM(context:string,query:string) {
    const response = await OpenAILLM.responses.create({
        model : "",
        input : [
            {
                role : "developer",
                content : `you are an expert in taking context and answering depending on this is the ${context}`
            },{
                role : "user",
                content : query
            }
        ]
    })

    return response.output_text
}