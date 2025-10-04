import { getAssignmentById } from "@/lib/actions";
import { NextResponse } from "next/server";
import fetch from "node-fetch";

export async function GET(
    request: Request,
    { params }: { params: { assignmentId: string } }
) {
    const assignmentId = params.assignmentId;
    
    if (!assignmentId) {
        return new NextResponse("Assignment ID is required", { status: 400 });
    }

    const assignment = await getAssignmentById(assignmentId);

    if (!assignment) {
        return new NextResponse("Assignment not found", { status: 404 });
    }

    if (!assignment.answerFileUrl) {
        return new NextResponse("Answer file not available", { status: 404 });
    }

    try {
        const fileResponse = await fetch(assignment.answerFileUrl);

        if (!fileResponse.ok) {
            console.error(`Failed to fetch file from ${assignment.answerFileUrl}. Status: ${fileResponse.status}`);
            return new NextResponse("Could not fetch file", { status: 500 });
        }

        const fileExtension = assignment.answerFilename?.split('.').pop() || (assignment.answerFileType === 'pdf' ? 'pdf' : 'jpg');
        const downloadFilename = `${assignment.title}_answer.${fileExtension}`;

        const headers = new Headers();
        headers.set('Content-Type', fileResponse.headers.get('Content-Type') || 'application/octet-stream');
        headers.set('Content-Disposition', `attachment; filename="${downloadFilename}"`);
        
        return new NextResponse(fileResponse.body, { status: 200, headers });

    } catch (error) {
        console.error("Error proxying answer file download:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
