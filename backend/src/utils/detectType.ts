
export type URlType =  "youtube" | "website" | "pdf"


export function detextType(url:string){
    try {
        const parsed = new URL(url);
        const hostName = parsed.hostname.toLocaleLowerCase();
        const pathName = parsed.pathname.toLocaleLowerCase();
        if(hostName.includes("youtube.com") || hostName.includes("youtu.be")){
            return "youtube"
        }
    
        if(hostName.includes("instagram.com")){
            if(hostName.includes("/reel/")) return "intagram_reel";
            if(hostName.includes("/p/")) return "instagram_post";
            return "website";
        }
    
        if(hostName.includes("twitter.com") || hostName.includes("x.com")){
            return "twitter_x";
        }
    
        if(hostName.includes("github.com")){
            return "github_repo";
        }
    
        if(pathName.endsWith(".pdf")){
            return "pdf";
        }
    
        if(pathName.match(/\.(docx|pptx|xlsx)$/)){
            return "document";
        }
    
        return "website";
    } catch (error) {
        return "invalid Url"
    }
}

