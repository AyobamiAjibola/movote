import { useAxios } from "../../../../utils/useAxios";

export default function Slider () {

  const { response: sum} = useAxios({
    method: 'GET',
    url: 'contestant/vote/sum'
  });

  const { response: total } = useAxios({
    method: 'GET',
    url: 'contestant/votemul/sum'
  });

  return (
    <div id="carouselExampleControls" className="carousel slide rounded" data-bs-ride="carousel"
      style={{
        height: 240,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 220,
      }}
    >
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="d-block" style={{height: 240, width: 300, backgroundColor: "#5b4d75"}}></div>
            <div className="carousel-caption d-none d-md-block">
              <div
                style={{
                  backgroundColor: "#b8b3c3",
                  height: 270,
                  width: 160,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-end",
                  overflow: "hidden",
                  marginBottom: 5
                }}
              >
                <h2 style={{ color: "#15023a", fontWeight: 600}}>Votes</h2>
              </div>
              <div style={{fontWeight: 500, marginBottom: 5}}><h5>Single Contest</h5></div>
              <div style={{marginTop: 10}}>
                <p style={{fontSize: 30, fontWeight:600}}>{sum}</p>
                <em>Total accumulated votes</em>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className="d-block" style={{height: 240, width: 300, backgroundColor: "#5b4d75"}}></div>
            <div className="carousel-caption d-none d-md-block">
              <div
                style={{
                  backgroundColor: "#b8b3c3",
                  height: 270,
                  width: 160,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-end",
                  overflow: "hidden",
                  marginBottom: 5
                }}
                className=""
              >
                <h2 style={{ color: "#15023a", fontWeight: 600}}>Votes</h2>
              </div>
              <div style={{fontWeight: 500, marginBottom: 5}}><h6>Category Contest</h6></div>
              <div style={{marginTop: 10}}>
                <p style={{fontSize: 30, fontWeight:600}}>{total}</p>
                <em>Total accumulated votes</em>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className="d-block" style={{height: 240, width: 300, backgroundColor: "#5b4d75"}}></div>
            <div className="carousel-caption d-none d-md-block">
              <div
                style={{
                  backgroundColor: "#b8b3c3",
                  height: 270,
                  width: 160,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-end",
                  overflow: "hidden",
                  marginBottom: 8
                }}
              >
                <h2 style={{ color: "#15023a", fontWeight: 600}}>Votes</h2>
              </div>
              <div style={{fontWeight: 500, marginBottom: 5}}><h5>Vote from all contests</h5></div>
              <div style={{marginTop: 10}}>
                <p style={{fontSize: 30, fontWeight:600}}>{String(sum + total)}</p>
              </div>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
    </div>
  )
}