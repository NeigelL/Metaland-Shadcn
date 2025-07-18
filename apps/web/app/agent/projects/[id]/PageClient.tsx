"use client";
import { useParams } from "next/navigation";

export default function PageClient() {
    const params = useParams()
    const id = params?.id as string
    const project_id = id

    return <div className="flex-1 p-4 space-y-6 max-w-7xl mx-auto w-full">
        <div className="space-y-4 sm:space-y-6">
            { project_id }
        </div>
    </div>
}