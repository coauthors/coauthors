export default function Page() {
  return <></>
}

export const getServerSideProps = () => ({ redirect: { destination: '/why', permanent: false } })
