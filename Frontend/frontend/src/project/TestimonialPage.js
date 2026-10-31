import React from 'react';
import "../projectCss/TestimonialPage.css"

const testimonials = [
  {
    id: 1,
    name: 'WILLIAM JAMES',
    title: 'CEO - Vinova',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris augue mi, interdum ut purus id, blandit suscipit mauris. Sed tortor lorem, eleifend non urna non, congue bibendum libero. Duis sodales pellentesque sagittis. Fusce venenatis sagittis pellentesque. Nunc eu eros in ipsum semper condimentum in a risus.'
  },
  {
    id: 2,
    name: 'WILLIAM JAMES',
    title: 'CEO - Vinova',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris augue mi, interdum ut purus id, blandit suscipit mauris. Sed tortor lorem, eleifend non urna non, congue bibendum libero. Duis sodales pellentesque sagittis. Fusce venenatis sagittis pellentesque. Nunc eu eros in ipsum semper condimentum in a risus.'
  },
  {
    id: 3,
    name: 'WILLIAM JAMES',
    title: 'CEO - Vinova',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris augue mi, interdum ut purus id, blandit suscipit mauris. Sed tortor lorem, eleifend non urna non, congue bibendum libero. Duis sodales pellentesque sagittis. Fusce venenatis sagittis pellentesque. Nunc eu eros in ipsum semper condimentum in a risus.'
  },
  {
    id: 4,
    name: 'WILLIAM JAMES',
    title: 'CEO - Vinova',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris augue mi, interdum ut purus id, blandit suscipit mauris. Sed tortor lorem, eleifend non urna non, congue bibendum libero. Duis sodales pellentesque sagittis. Fusce venenatis sagittis pellentesque. Nunc eu eros in ipsum semper condimentum in a risus.'
  },
  {
    id: 5,
    name: 'WILLIAM JAMES',
    title: 'CEO - Vinova',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=faces',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris augue mi, interdum ut purus id, blandit suscipit mauris. Sed tortor lorem, eleifend non urna non, congue bibendum libero. Duis sodales pellentesque sagittis. Fusce venenatis sagittis pellentesque. Nunc eu eros in ipsum semper condimentum in a risus.'
  }
];

const TestimonialPage = () => {
  return (
    <div className="testimonial-page">
      <div className="container">
        <h1 className="page-title">Testimonial</h1>

        <div className="testimonials-list">
          {testimonials.map((item) => (
            <div className="testimonial-card" key={item.id}>
              <div className="testimonial-image">
                <img src={item.image} alt={item.name} />
              </div>

              <div className="testimonial-content">
                <h3 className="name">{item.name}</h3>
                <p className="title">{item.title}</p>
                <p className="text">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialPage;