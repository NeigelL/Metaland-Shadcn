


import PageClient from "./PageClient";

type PageProps = {
  params: {
    id: string
  }
}

export default function AmortizationPageDetail(props: PageProps) {
  const { id } = props.params

  return id && <PageClient amortization_id={id} />
}