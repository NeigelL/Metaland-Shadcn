


import PageClient from "./PageClient";

type PageProps = {
  params: {
    id: string
  }
}

export default async function AmortizationPageDetail( params :  PageProps) {

  const { id } = params.params;

  return id && <PageClient  amortization_id={id}/>
}
