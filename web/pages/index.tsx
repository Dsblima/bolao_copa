interface HomeProps {
  count: number;
}
export default function Home(props: HomeProps) {
  return (
    <h1>Count: {props.count}</h1>
  )
}

export const getServerSideProps = async () => {
  const reponse = await fetch('http://localhost:3333/pools/count')
  const data = await reponse.json()
  console.log(data)
  return {
    props: {
      count: data.count,
    }
  }
}
