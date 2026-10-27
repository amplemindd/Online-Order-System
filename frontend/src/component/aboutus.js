import React from "react";
import aboutImg from '../images/about-img.png'
import '../css/aboutus.css'
import logo4 from '../images/video.png'
import blogimg1 from '../images/health_files/blog_img01.jpg'
import blogimg2 from '../images/health_files/blog_img02.jpg'
import blogimg3 from '../images/blog_img03.jpg'

function Aboutus() {
  return (
    <>
    <section className="about-section">
      <div className="about-container">
        <div className="about-left">
          <div className="circle-bg"></div>
          <img src={aboutImg} alt="Workout" className="about-img" />
         
        </div>

        <div className="about-right">
          <h1>
            Let Us Find The Perfect <br />
            Workout For You !
          </h1>

          <div className="dots">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>

          <div className="about-text">
            <p>
              Fusce orci ligula, tincidunt ut metus vel, venenatis aliquet tortor. 
              Duis et consequat enim. Curabitur pulvinar, dolor at pulvinar molestie, 
              augue massa volutpat felis, at rhoncus tortor velit vel diam. Cras ac suscipit metus.
            </p>

            <p>
              Etiam fermentum ex orci, a ullamcorper erat tempor in. Nulla est ante, 
              ullamcorper vitae dui vel, molestie feugiat sapien.
            </p>

            <p>
              Integer auctor est nec semper hendrerit. Etiam sollicitudin enim in urna commodo, 
              in dapibus velit elementum. Ut congue nisi sapien, vel ultricies nulla tincidunt vitae. 
              Maecenas non ligula quis massa consequat commodo eleifend ut velit. Vestibulum 
              molestie nunc non libero posuere, quis pellentesque massa tempus.
            </p>
          </div>
        </div>
      </div>

      
    </section>
    <section className="fitness-section">
        <div className="fitness-container">
  
          <div className="fitness-left">
            <h2>
              The Fitness You Will Enjoy <br />
              With Our Workout
            </h2>

            <div className="dots white-dots">
              <span className="dot active"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>

            <div className="fitness-text">
              <p>
                Integer auctor est nec semper hendrerit. Etiam sollicitudin enim in urna commodo, 
                in dapibus velit elementum. Ut congue nisi sapien, vel ultricies nulla tincidunt vitae. 
                Maecenas non ligula quis massa consequat commodo eleifend ut velit.
              </p>
              <p>
                Aenean euismod est eget eros molestie pretium. Curabitur varius velit in est elementum 
                consectetur. Mauris in risus bibendum, laoreet ex at, lobortis risus. Nullam id massa eget 
                ante feugiat iaculis. Duis eget nisi ipsum. Vivamus ipsum urna, tristique vel arcu nec, 
                elementum congue est. Nullam vitae aliquet turpis.
              </p>
            </div>
          </div>


          <div className="fitness-right">
            <div className="video-wrapper">
              <img src={logo4} alt="Fitness Workout" className="fitness-img" />
              
              

             
            </div>
          </div>
        </div>
      </section>
      
<section className="testimonials-section">
  <div className="section-header">
    <h2>What Our Client Say’s</h2>
    <div className="dots">
      <span className="dot active"></span>
      <span className="dot"></span>
      <span className="dot"></span>
    </div>
  </div>

  <div className="testimonials-container">
    <div className="testimonial-card">
      <div className="card-left-bar"></div>
      <div className="card-content">
        <div className="client-info">
          <img src={blogimg1} alt="Louis Carlson" />
          <div>
            <h4>Louis Carlson</h4>
            <span>CEO & Founder</span>
          </div>
         
        </div>
        <p>
          Integer auctor est nec semper hendrerit. Etiam sollicitudin enim 
          in urna commodo, in dapibus velit elementum.
        </p>
      </div>
    </div>

    <div className="testimonial-card">
      <div className="card-left-bar"></div>
      <div className="card-content">
        <div className="client-info">
          <img src= {blogimg2} alt="Rose Dose" />
          <div>
            <h4>Rose Dose</h4>
            <span>Sale Executive</span>
          </div>
          
        </div>
        <p>
          Integer auctor est nec semper hendrerit. Etiam sollicitudin enim 
          in urna commodo, in dapibus velit elementum.
        </p>
      </div>
    </div>

    <div className="testimonial-card">
      <div className="card-left-bar"></div>
      <div className="card-content">
        <div className="client-info">
          <img src= {blogimg3} alt="Louis Carlson" />
          <div>
            <h4>Louis Carlson</h4>
            <span>Web Developer</span>
          </div>
          
        </div>
        <p>
          Integer auctor est nec semper hendrerit. Etiam sollicitudin enim 
          in urna commodo, in dapibus velit elementum.
        </p>
      </div>
    </div>
  </div>
</section>
<section className="blog-section">
  <div className="section-header">
    <h2>What Our Client Say’s</h2>
    <div className="dots">
      <span className="dot active"></span>
      <span className="dot"></span>
      <span className="dot"></span>
    </div>
  </div>

  <div className="blog-container">
    {/* Blog Card 1 */}
    <div className="blog-card">
      <div className="blog-img-wrapper">
        <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400" alt="Blog 1" />

      </div>
      <div className="blog-meta">
        <span>📅 7 March, 2019</span>
        <span>👤 By Jhone Doe</span>
      </div>
      <h3>Praesent justo mauris, tincidunt vitae nisi ultricies.</h3>
      <p>
        Integer auctor est nec semper hendrerit. Etiam sollicitudin enim 
        in urna commodo, in dapibus velit elementum.
      </p>
      <a href="#" className="read-more">Read More →</a>
    </div>

    <div className="blog-card">
      <div className="blog-img-wrapper">
        <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400" alt="Blog 2" />
    
      </div>
      <div className="blog-meta">
        <span>📅 7 March, 2019</span>
        <span>👤 By Jhone Doe</span>
      </div>
      <h3>Monthly eraesent justo mauris, vitae nisi ultricies.</h3>
      <p>
        Integer auctor est nec semper hendrerit. Etiam sollicitudin enim 
        in urna commodo, in dapibus velit elementum.
      </p>
      <a href="#" className="read-more">Read More →</a>
    </div>

    <div className="blog-card">
      <div className="blog-img-wrapper">
        <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400" alt="Blog 3" />

      </div>
      <div className="blog-meta">
        <span>📅 7 March, 2019</span>
        <span>👤 By Jhone Doe</span>
      </div>
      <h3>User Experience Psychology And Performance Smashing</h3>
      <p>
        Integer auctor est nec semper hendrerit. Etiam sollicitudin enim 
        in urna commodo, in dapibus velit elementum.
      </p>
      <a href="#" className="read-more">Read More →</a>
    </div>
  </div>
</section>
      </>
  );

}

export default Aboutus;