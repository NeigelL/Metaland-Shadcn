import GalleryWithUploader from "../Uploads/GalleryWithUploader";

export default function ProofDropOff({
    user_id
}: {
    user_id: string;
}) {
    return (
        <GalleryWithUploader
            options={{
                folder: ["proofs", user_id].join("/"),
                entityID: "proofs",
                collection: "proofs",
                label: "Upload Proof of Payment"
            }}
            onCompleteCallback={() => {
            }}
        />
    );
}