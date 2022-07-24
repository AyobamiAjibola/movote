import "./aboutUs.scss";
import Typewriter from "typewriter-effect";

export default function AboutUs() {

  return (
    <div className="about" id="about">
      <div className="left">
        <div className="imgContainer">
          <img src="assets/man.jpg" alt="" />
        </div>
      </div>
      <div className="right">
        <div className="wrapper">
          <div className="wrap">
            <h3>Online Voting</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Temporibus omnis similique dolor magnam harum, hic ratione
              quasi repellendus veniam pariatur sapiente ab necessitatibus fuga! Nulla,
              doloremque eius. Voluptas, illo aliquam.
            </p>
            <p style={{fontWeight: 400, color: "#15023a", marginTop: "20px"}}>Register your contest in three simple steps.......</p>
            <div className="spanWrapper">
              <span> Step 1:
                <span>
                  <Typewriter
                    onInit={(typewriter) => {
                      typewriter
                        .typeString(" Scroll to the package section.")
                        .start();
                    }}
                  />
                </span>
              </span>
              <span> Step 2:
                <span>
                  <Typewriter
                    onInit={(typewriter) => {
                      setTimeout(() => {
                        typewriter
                        .typeString(" Choose a plan that suites you.")
                        .start();
                      }, 5000);
                    }}
                  />
                </span>
              </span>
              <span> Step 3:
                <span>
                  <Typewriter
                    onInit={(typewriter) => {
                      setTimeout(() => {
                        typewriter
                        .typeString(" And send us message.")
                        .start();
                      }, 10000);
                    }}
                  />
                </span>
              </span>
            </div>
          </div>
        </div>
        <a href="#contest">
          <img src="assets/down.png" alt="" />
        </a>
      </div>
    </div>
  )
}
