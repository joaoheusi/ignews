import { GetServerSideProps, GetStaticProps } from "next";
import Head from "next/head";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";
import styles from "./home.module.scss";

// Client-side -- useEffect
// Server-side rendering
// Static Site generation

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>IgNews | Home</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span> 👋 Hey, Welcome</span>
          <h1>
            News about <br /> the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount}/month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/images/avatar.svg" alt="" />
      </main>
    </>
  );
}

// getServerSideProps - SSR
// getStaticProps - SSG - salva html no next e da próxima
// vez ele retorna o html estático já salvo
// ------------------------------------------------------
// somente usar SSG quando a mesma página(mesmas informações)
// for ser exibida para todos os usuários

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1KIPBcJ3RrkvoceXSgloqYAw");

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };
  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24hours - quanto tempo o conteúdo da página deve ficar salvo?
    // revalidate somente para getStaticProps
  };
};
