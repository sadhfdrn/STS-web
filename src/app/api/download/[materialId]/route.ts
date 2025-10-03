import { getCourseMaterialById } from "@/lib/actions";
import { NextResponse } from "next/server";
import fetch from "node-fetch";

export async function GET(
    request: Request,
    { params }: { params: { materialId: string } }
) {
    const materialId = params.materialId;
    
    if (!materialId) {
        return new NextResponse("Material ID is required", { status: 400 });
    }

    const material = await getCourseMaterialById(materialId);

    if (!material) {
        return new NextResponse("Material not found", { status: 404 });
    }

    try {
        const fileResponse = await fetch(material.fileUrl);

        if (!fileResponse.ok) {
            console.error(`Failed to fetch file from ${material.fileUrl}. Status: ${fileResponse.status}`);
            return new NextResponse("Could not fetch file", { status: 500 });
        }

        const headers = new Headers();
        headers.set('Content-Type', fileResponse.headers.get('Content-Type') || 'application/octet-stream');
        headers.set('Content-Disposition', `attachment; filename="${material.filename}"`);
        
        // Use ReadableStream from the fetch response body
        return new NextResponse(fileResponse.body, { status: 200, headers });

    } catch (error) {
        console.error("Error proxying file download:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
