import "./payment.scss"

export default function Payment() {

  const data = [
    {
      id: 1,
      name: "Simple",
      title: "Pay As U Vote",
      fee: "20% on each vote",
      desc:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat magnam dolorem.",
    },
    {
      id: 2,
      name: "Premium",
      title: "Monthly Payment",
      fee: "100,000NGN (Monthly)",
      desc:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat magnam dolorem recusandae perspiciatis ducimus vel hic temporibus. ",
      featured: true
    },
    {
      id: 3,
      name: "Free Voting",
      title: "Monthly Payment",
      fee: "100,000NGN (Monthly)",
      desc:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat magnam dolorem recusandae perspiciatis ducimus vel hic temporibus. ",
      size: true
    }
  ];
  return (
    <div className="payment" id="payment">
      <h1>Packages</h1>
      <div className="container">
        {data.map((d) => (
          <div className={d.featured ? "card featured" : "card"} key={d.id}>
            <div className="top">
              <h6 className={d.size ? "pack size" : "pack"}>{d.name}</h6>
              <h3>{d.title}</h3>
            </div>
            <div className="center">
              <p>{d.desc}</p>
            </div>
            <div className="bottom">
              <h1>{d.fee}</h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
