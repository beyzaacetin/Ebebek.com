(function () {
 
  if (window.location.pathname !== "/") {
      console.log("wrong page");
      return;
  }

  
  const carouselTitle = "Sizin için Seçtiklerimiz";

  
  const apiUrl = "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json";

  
  const placeholderImage = "https://www.e-bebek.com/assets/images/cok-satan@2x.png";

  
  const localStorageKey = "productList";
  const favoritesKey = "favoriteProducts";

  
  const favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];

  
  fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
          products = data;
          localStorage.setItem(localStorageKey, JSON.stringify(products));
          createCarousel(products);
      })
      .catch(err => console.error("Veri getirilemedi:", err));

  
  function generateStars() {
      const maxStars = 5;
      const filledStars = Math.floor(Math.random() * (maxStars + 1));
      let starsHtml = '';
      for (let i = 0; i < maxStars; i++) {
          starsHtml += `<span class="star ${i < filledStars ? 'filled' : ''}">★</span>`;
      }
      return starsHtml;
  }

  
  function createCarousel(products) {
      const container = document.createElement("div");
      container.className = "product-carousel";
      
      const title = document.createElement("h2");
      title.innerText = carouselTitle;
      container.appendChild(title);

      const productList = document.createElement("div");
      productList.className = "product-list";

      products.forEach(product => {
          const productCard = document.createElement("div");
          productCard.className = "product-card";

          
          const productImage = product.img ? product.img : placeholderImage;

          
          const isFavorite = favorites.includes(product.id.toString());

          
          const discountPercentage = product.original_price > product.price
              ? Math.floor(((product.original_price - product.price) / product.original_price) * 100)
              : null;

          productCard.innerHTML = `
              <div class="product-image">
                  <img src="${productImage}" alt="${product.name}" />
                  <button class="custom-heart-btn ${isFavorite ? 'active' : ''}" data-id="${product.id}" aria-label="Favorilere ekle">
                      <svg class="heart-icon ${isFavorite ? 'filled' : ''}" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                      </svg>
                  </button>
              </div>
              <p class="title">${product.name}</p>
              <div class="stars">
                  ${generateStars()}
              </div>
              <p class="price">
                  ${product.original_price > product.price ? `<span class="original-price">${product.original_price}₺</span>` : ""}
                  <span class="current-price">${product.price}₺</span>
                  ${discountPercentage ? `<span class="discount-tag">-%${discountPercentage}</span>` : ""}
              </p>
              <div class="button-container">
                  <button class="add-to-cart">Sepete Ekle</button>
              </div>
          `;

          
          productCard.querySelector(".custom-heart-btn").addEventListener("click", (e) => {
              e.stopPropagation();
              const id = e.currentTarget.dataset.id;
              const icon = e.currentTarget.querySelector('.heart-icon');
              
              if (favorites.includes(id)) {
                  favorites.splice(favorites.indexOf(id), 1);
                  icon.classList.remove('filled');
                  icon.style.fill = "transparent";
              } else {
                  favorites.push(id);
                  icon.classList.add('filled');
                  icon.style.fill = "orange";
              }
              localStorage.setItem(favoritesKey, JSON.stringify(favorites));
          });

          productList.appendChild(productCard);
      });

      container.appendChild(productList);
      
      document.body.insertBefore(container, document.body.firstChild);
  }

  
  const style = document.createElement("style");
  style.innerHTML = `
      .product-carousel h2 {
          text-align: center;
          font-size: 24px;
          margin-bottom: 20px;
      }
      .product-list {
          display: flex;
          gap: 15px;
          overflow-x: auto;
      }
      .product-card {
          min-width: 240px;
          max-width: 240px;
          border: 1px solid #ddd;
          padding: 10px;
          background: #fff;
          border-radius: 15px;
          position: relative;
      }
      .product-image {
          position: relative;
      }
      .custom-heart-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          background: white;
          border: none;
          border-radius: 50%;
          box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 2;
      }
      .heart-icon {
          width: 24px;
          height: 24px;
          fill: transparent;
          stroke: orange;
          stroke-width: 1.5px;
          transition: fill 0.3s;
      }
      .heart-icon.filled {
          fill: orange;
      }
      .stars {
          display: flex;
          gap: 2px;
      }
      .star {
          font-size: 16px;
          color: #ccc;
      }
      .star.filled {
          color: orange;
      }
      .add-to-cart {
          width: 100%;
          padding: 15px 20px;
          border-radius: 37.5px;
          background-color: #fff7ec;
          color: #f28e00;
          font-family: Poppins, "cursive";
          font-size: 1.4rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: 15px;
      }
  `;
  document.head.appendChild(style);
})();
