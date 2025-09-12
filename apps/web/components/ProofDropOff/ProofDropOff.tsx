import { useSocketBroadcast } from "@/hooks/useSocketListener";
import { debounceWithKey } from "../api/debounceWithKey";
import GalleryWithUploader from "../Uploads/GalleryWithUploader";
import { useUserStore } from "@/stores/useUserStore";
import { EnumSOCKET } from "@/serverConstant";

export default function ProofDropOff({
    user_id
}: {
    user_id: string;
}) {
    const {first_name, middle_name, last_name} = useUserStore()
    return (
        <GalleryWithUploader
            options={{
                folder: ["proofs", user_id].join("/"),
                entityID: "proofs",
                collection: "proofs",
                label: "Upload Proof of Payment"
            }}
            onCompleteCallback={
                (files:any[]) => {
                    if(files.length === 0) return;
                    debounceWithKey("user-proofs-" + user_id, () => {
                        useSocketBroadcast(EnumSOCKET.USER_PROOFS, { message: [first_name, middle_name, last_name,  "has uploaded a proof of payment, click here to view"].join(" "), link: `/users/${user_id}?tab=proof` });
                    },5000)();
                }
            }
        />
    );
}