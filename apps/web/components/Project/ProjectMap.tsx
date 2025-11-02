import { useParams } from "next/navigation"
import AgentProjectMap from "../GoogleMap/AgentProjectMap"


export default function ProjectMap({
    projectPath
}:any) {
     const params = useParams()
     return <AgentProjectMap projectPath={projectPath} /> 
}