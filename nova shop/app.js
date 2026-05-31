const { useEffect, useMemo, useState } = React;

const products = [
  {
    id: 1,
    name: "DeskFlow Pro",
    category: "Software",
    price: 89,
    rating: 4.9,
    stock: 28,
    sales: 1240,
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
    tags: ["SaaS", "Productivity", "Team"],
    description: "A focused workspace toolkit for teams that need clean planning, docs, and delivery.",
  },
  {
    id: 2,
    name: "Aurora Headset",
    category: "Tech",
    price: 149,
    rating: 4.7,
    stock: 16,
    sales: 880,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    tags: ["Audio", "Bluetooth", "Premium"],
    description: "Wireless audio tuned for calls, music, and long creative sessions.",
  },
  {
    id: 3,
    name: "Creator Camera",
    category: "Tech",
    price: 420,
    rating: 4.8,
    stock: 9,
    sales: 510,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
    tags: ["4K", "Studio", "Travel"],
    description: "A compact creator camera with sharp video, confident autofocus, and travel-ready build.",
  },
  {
    id: 4,
    name: "Launch Kit",
    category: "Marketing",
    price: 59,
    rating: 4.6,
    stock: 40,
    sales: 1640,
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80",
    tags: ["Brand", "Social", "Ads"],
    description: "Templates, launch checklists, and ad assets for faster product campaigns.",
  },
  {
    id: 5,
    name: "Focus Chair",
    category: "Office",
    price: 260,
    rating: 4.5,
    stock: 12,
    sales: 430,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=900&q=80",
    tags: ["Ergonomic", "Home", "Work"],
    description: "An ergonomic chair built for home offices that need support without visual noise.",
  },
  {
    id: 6,
    name: "Analytics Suite",
    category: "Software",
    price: 129,
    rating: 4.9,
    stock: 22,
    sales: 970,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
    tags: ["Data", "Reports", "Growth"],
    description: "Clear dashboards and automated reporting for sales, marketing, and operations.",
  },
];

const orders = [
  { id: "#NS-2048", client: "Arta Group", amount: "$1,280", status: "Shipped", date: "May 31", items: 4 },
  { id: "#NS-2047", client: "Kodra Studio", amount: "$740", status: "Processing", date: "May 30", items: 2 },
  { id: "#NS-2046", client: "Besa Labs", amount: "$2,110", status: "Shipped", date: "May 29", items: 7 },
  { id: "#NS-2045", client: "Metro Tech", amount: "$560", status: "Paid", date: "May 28", items: 1 },
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function App() {
  const [activeView, setActiveView] = useState("shop");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("popular");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const categories = ["All", ...new Set(products.map((product) => product.category))];

  const filteredProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    const result = products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const searchable = `${product.name} ${product.category} ${product.tags.join(" ")}`.toLowerCase();
      return matchesCategory && searchable.includes(term);
    });

    return [...result].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "stock") return a.stock - b.stock;
      return b.rating - a.rating;
    });
  }, [query, category, sort]);

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const lowStockCount = products.filter((product) => product.stock <= 12).length;
  const averageRating =
    products.reduce((sum, product) => sum + product.rating, 0) / products.length;

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: Math.min(item.stock, item.qty + 1) } : item
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const updateQty = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, qty: Math.min(item.stock, Math.max(0, item.qty + delta)) }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const resetFilters = () => {
    setQuery("");
    setCategory("All");
    setSort("popular");
  };

  return (
    <div className="app">
      <div className="topbar">
        <div className="nav">
          <div className="brand">
            <div className="brand-mark">NS</div>
            <div>
              <div>NovaShop Studio</div>
              <small>Storefront and orders</small>
            </div>
          </div>

          <div className="nav-links" aria-label="Primary navigation">
            <button
              className={activeView === "shop" ? "active" : ""}
              onClick={() => setActiveView("shop")}
            >
              Shop
            </button>
            <button
              className={activeView === "orders" ? "active" : ""}
              onClick={() => setActiveView("orders")}
            >
              Orders
            </button>
          </div>

          <div className="nav-actions">
            <button
              className="icon-btn"
              title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
            >
              {theme === "light" ? "Moon" : "Sun"}
            </button>
            <button className="cart-toggle" onClick={() => setCartOpen((open) => !open)}>
              Cart <span>{totalItems}</span>
            </button>
          </div>
        </div>
      </div>

      <main className="page-content">
        <section className="overview">
          <div>
            <span className="eyebrow">Live commerce workspace</span>
            <h1>Build, browse, and manage a sharper online shop.</h1>
            <p>
              A polished React demo with product discovery, cart management, order tracking,
              inventory signals, and a theme that feels finished on desktop and mobile.
            </p>
          </div>

          <div className="stats-grid" aria-label="Store metrics">
            <div>
              <strong>{products.length}</strong>
              <span>Products</span>
            </div>
            <div>
              <strong>{averageRating.toFixed(1)}</strong>
              <span>Avg rating</span>
            </div>
            <div>
              <strong>{lowStockCount}</strong>
              <span>Low stock</span>
            </div>
          </div>
        </section>

        {activeView === "shop" && (
          <section className="shop-view">
            <div className="shop-header">
              <div>
                <h2>Product catalog</h2>
                <p>{filteredProducts.length} products found</p>
              </div>

              <div className="filters">
                <input
                  type="search"
                  placeholder="Search products..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />

                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <select value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="stock">Lowest Stock</option>
                </select>
              </div>
            </div>

            <div className="product-grid">
              {filteredProducts.length === 0 ? (
                <div className="empty-state">
                  <strong>No products match your filters.</strong>
                  <p>Try a different search term or category.</p>
                  <button onClick={resetFilters}>Reset filters</button>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <article key={product.id} className="product-card">
                    <div className="product-media">
                      <img src={product.image} alt={product.name} />
                      <span>{product.category}</span>
                    </div>
                    <div className="product-body">
                      <div className="product-title">
                        <h3>{product.name}</h3>
                        <strong>{currency.format(product.price)}</strong>
                      </div>
                      <p>{product.description}</p>
                      <div className="tag-row">
                        {product.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                      <div className="product-meta">
                        <span>Rating {product.rating}</span>
                        <span>{product.stock} in stock</span>
                      </div>
                      <div className="product-footer">
                        <small>{product.sales.toLocaleString()} sold</small>
                        <button onClick={() => addToCart(product)}>Add to cart</button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        )}

        {activeView === "orders" && (
          <section className="orders-view">
            <div className="shop-header">
              <div>
                <h2>Order history</h2>
                <p>Recent customer activity and fulfillment status</p>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.client}</td>
                      <td>{order.date}</td>
                      <td>{order.items}</td>
                      <td>{order.amount}</td>
                      <td>
                        <span className={`status ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {cartOpen && (
        <div className="cart-shell" role="presentation" onClick={() => setCartOpen(false)}>
          <aside
            className="cart-panel"
            role="dialog"
            aria-label="Shopping cart"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cart-header">
              <div>
                <h2>Your cart</h2>
                <p>{totalItems} items selected</p>
              </div>
              <button className="icon-btn" aria-label="Close cart" onClick={() => setCartOpen(false)}>
                Close
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <strong>Your cart is empty.</strong>
                <p>Add a product and it will appear here instantly.</p>
              </div>
            ) : (
              <ul className="cart-items">
                {cart.map((item) => (
                  <li key={item.id} className="cart-item">
                    <img src={item.image} alt="" />
                    <div>
                      <strong>{item.name}</strong>
                      <p>{currency.format(item.price)} x {item.qty}</p>
                    </div>
                    <div className="cart-controls">
                      <button aria-label={`Decrease ${item.name}`} onClick={() => updateQty(item.id, -1)}>
                        -
                      </button>
                      <span>{item.qty}</span>
                      <button aria-label={`Increase ${item.name}`} onClick={() => updateQty(item.id, 1)}>
                        +
                      </button>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="cart-summary">
              <div>
                <span>Total items</span>
                <strong>{totalItems}</strong>
              </div>
              <div>
                <span>Total price</span>
                <strong>{currency.format(totalPrice)}</strong>
              </div>
              <button disabled={cart.length === 0}>Checkout</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
