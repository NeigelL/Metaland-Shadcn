


import PageClient from "./PageClient";
import { getBuyerAmortizationSummaryService } from "@/services/buyerService";


type Props = {
  params: { id: string }
}


export default async function AmortizationPageDetail({ params }: Props) {

  const { id } = params;


  return id && <PageClient  amortization_id={id}/>
}
