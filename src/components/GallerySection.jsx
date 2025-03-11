import { useState, useEffect } from "react"
import "./GallerySection.css"

const GallerySection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const galleryItems = [
    {
      id: 1,
      category: "water-show",
      image: "https://images.unsplash.com/photo-1576438162986-c685b87fbc4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      title: "Musical Water Show",
      description: "Spectacular water fountain choreography"
    },
    {
      id: 2,
      category: "water-show",
      image: "https://images.unsplash.com/photo-1585938389612-a552a28d6914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      title: "Laser Light Show",
      description: "Mesmerizing laser and water combinations"
    },
    {
      id: 3,
      category: "garden",
      image: "https://images.unsplash.com/photo-1585938389612-a552a28d6914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      title: "Flower Garden",
      description: "Beautiful seasonal flowers"
    },
    {
      id: 4,
      category: "garden",
      image: "https://images.unsplash.com/photo-1576438162986-c685b87fbc4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      title: "Botanical Garden",
      description: "Diverse collection of plants"
    },
    {
      id: 5,
      category: "park",
      image: "https://images.unsplash.com/photo-1564226803042-24b2c8d80c4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      title: "Children's Play Area",
      description: "Safe and fun playground equipment"
    },
    {
      id: 6,
      category: "park",
      image: "https://images.unsplash.com/photo-1585938389612-a552a28d6914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      title: "Walking Trails",
      description: "Scenic pathways through the park"
    }
  ]

  const filterItems = (category) => {
    setSelectedCategory(category)
  }

  const filteredItems = selectedCategory === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory)

  return (
    <section className="gallery-section" id="gallery">
      <div className="section-title">
        <h2>Our Gallery</h2>
        <p>Explore the beauty of Sant Dnyaneshwar Udyan</p>
      </div>

      <div className="gallery-filter">
        <button 
          className={`filter-btn ${selectedCategory === "all" ? "active" : ""}`}
          onClick={() => filterItems("all")}
        >
          All
        </button>
        <button 
          className={`filter-btn ${selectedCategory === "water-show" ? "active" : ""}`}
          onClick={() => filterItems("water-show")}
        >
          Water Show
        </button>
        <button 
          className={`filter-btn ${selectedCategory === "garden" ? "active" : ""}`}
          onClick={() => filterItems("garden")}
        >
          Garden
        </button>
        <button 
          className={`filter-btn ${selectedCategory === "park" ? "active" : ""}`}
          onClick={() => filterItems("park")}
        >
          Park
        </button>
      </div>

      <div className="gallery-grid">
        {filteredItems.map((item) => (
          <div key={item.id} className="gallery-item">
            <div className="gallery-image">
              <img src={item.image} alt={item.title} />
              <div className="gallery-overlay">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default GallerySection 