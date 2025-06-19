


import PageClient from "./PageClient";


export default async function AmortizationPageDetail({ params }: {params: { id: string }}) {

  const { id } = params;


  return id && <PageClient  amortization_id={id}/>
}
