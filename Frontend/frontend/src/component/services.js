import React from "react";
import "../css/services.css";

function Services() {
  return (
    <div className="servicesmain">
      <div className="servicesleft">

        <div className="servicecard">
          <div className="icon-box blue">
            <span className="icon">🧘</span>
          </div>
          <h3>Yoga</h3>
          <p>
            Nam pellentesque, velit at sodales elementum, neque metus ultricies justo, 
            eget varius diam justo ac ante.
          </p>
        </div>

        <div className="servicecard">
          <div className="icon-box blue">
            <span className="icon">💃</span>
          </div>
          <h3>Dance</h3>
          <p>
            Nam pellentesque, velit at sodales elementum, neque metus ultricies justo, 
            eget varius diam justo ac ante.
          </p>
        </div>

      
        <div className="servicecard">
          <div className="icon-box orange">
            <span className="icon">🏋️</span>
          </div>
          <h3>Fitness</h3>
          <p>
            Nam pellentesque, velit at sodales elementum, neque metus ultricies justo, 
            eget varius diam justo ac ante.
          </p>
        </div>
        <div className="servicecard">
          <div className="icon-box blue">
            <span className="icon">❤️</span>
          </div>
          <h3>Health</h3>
          <p>
            Nam pellentesque, velit at sodales elementum, neque metus ultricies justo, 
            eget varius diam justo ac ante.
          </p>
        </div>
      </div>

      <div className="servicesright">
        <h1>
          Build Your Body Transform <br />
          Your Life
        </h1>

        <div className="dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>

        <div className="services-text">
          <p>
            Integer auctor est nec semper hendrerit. Etiam sollicitudin enim in urna 
            commodo, in dapibus velit elementum. Ut congue nisi sapien, vel ultricies 
            nulla tincidunt vitae. Maecenas non ligula quis massa consequat commodo 
            eleifend ut velit.
          </p>
          <p>
            Aenean eleifend est eget eros molestie pretium. Curabitur varius velit in 
            est elementum consectetur. Mauris in risus bibendum, laoreet ex at, lobortis 
            risus. Nullam id massa eget ante finibus iaculis. Duis eget nisi ipsum. 
            Vivamus ipsum urna, tristique vel arcu nec, elementum congue est. Nullam 
            vitae aliquet turpis.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Services;