import { useState, useRef, useEffect } from 'react'
import {
  Gem,
  Search,
  ShoppingBag,
  Plus,
  Trash2,
  Weight,
  IndianRupee,
  Package,
  Sparkles,
  ArrowRight,
  LoaderCircle,
  ShieldCheck,
  X,
  ScanSearch,
  CircleCheck,
} from 'lucide-react'

import './Home.css'

const Home = () => {
  const [productCode, setProductCode] = useState('')
  const [productData, setProductData] = useState(null)
  const [cart, setCart] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // =================================
  // SEARCH PRODUCT
  // =================================

  const onSubmitData = async (e) => {
    e.preventDefault()

    const searchCode = productCode.trim()

    if (!searchCode) {
      setError('Please enter a product code.')
      return
    }

    setLoading(true)
    setError('')
    setProductData(null)
    setProductCode('')

    const apiUrl = import.meta.env.VITE_API_URL || ''

    const requestUrl = `${apiUrl}/api/sheet?code=${encodeURIComponent(
      searchCode
    )}`

    try {
      const res = await fetch(requestUrl, {
        method: 'GET',
        cache: 'no-store',
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Product not found.')
      }

      if (!data.success || !Array.isArray(data.data)) {
        throw new Error('Invalid product response.')
      }

      setProductData(data)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  // =================================
  // GET SHEET VALUE
  // =================================

  const getValue = (data, index) => {
    return data?.[index]?.[1] ?? '-'
  }

  const getAmount = (value) => {
    const amount = Number(
      String(value ?? '')
        .replace(/,/g, '')
        .trim()
    )

    return Number.isFinite(amount) ? amount : 0
  }

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // =================================
  // ADD PRODUCT TO CART
  // =================================

  const addToCart = () => {
    if (!productData?.data) return

    const rows = productData.data

    const newProduct = {
      code: productData.code,
      name: getValue(rows, 2),
      grossWeight: getValue(rows, 3),
      lessWeight: getValue(rows, 4),
      netWeight: getValue(rows, 5),
      rate: getValue(rows, 6),
      making: getValue(rows, 7),
      extra: getValue(rows, 8),
      price: getAmount(getValue(rows, 9)),
      quote: rows?.[10]?.[1] || '',
      quantity: 1,
    }

    setCart((previousCart) => {
      const existingIndex = previousCart.findIndex(
        (item) => item.code === newProduct.code
      )

      if (existingIndex !== -1) {
        return previousCart.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...previousCart, newProduct]
    })

    setProductData(null)
    setProductCode('')
    setError('')

    inputRef.current?.focus()
  }

  // =================================
  // REMOVE PRODUCT
  // =================================

  const removeFromCart = (code) => {
    setCart((previousCart) => previousCart.filter((item) => item.code !== code))
  }

  // =================================
  // CART TOTALS
  // =================================

  const grandTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  const totalWeight = cart.reduce(
    (total, item) => total + getAmount(item.netWeight) * item.quantity,
    0
  )

  // =================================
  // UI
  // =================================

  return (
    <main className='shringaar-app'>
      {/* DECORATIVE BACKGROUND */}

      <div className='ambient ambient-one'></div>
      <div className='ambient ambient-two'></div>

      {/* HEADER */}

      <header className='shringaar-header'>
        <div className='brand-mark'>
          <div className='brand-icon'>
            <Gem size={25} strokeWidth={1.5} />
          </div>

          <div className='brand-content'>
            <h1>SHRINGAAR</h1>
            <span>THE ART OF ADORNMENT</span>
          </div>
        </div>

        <div className='header-right'>
          <div className='exhibition-status'>
            <span className='status-dot'></span>
            SPECIAL EXHIBITION
          </div>

          <div className='header-divider'></div>

          <span className='header-tagline'>Elegance in every detail</span>
        </div>
      </header>

      {/* HERO SECTION */}

      <section className='hero-section'>
        <div className='hero-content'>
          <div className='hero-eyebrow'>
            <Sparkles size={14} />
            <span>A CELEBRATION OF FINE JEWELLERY</span>
            <Sparkles size={14} />
          </div>

          <h2>
            Discover the beauty
            <br />
            of <span>timeless jewellery.</span>
          </h2>

          <p>
            Explore exquisite craftsmanship, discover your favourites and create
            your personalised jewellery quotation.
          </p>

          <div className='hero-decoration'>
            <span></span>
            <Gem size={17} />
            <span></span>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}

      <section className='main-content'>
        {/* PRODUCT SEARCH CARD */}

        <div className='search-panel luxury-panel'>
          <div className='section-heading'>
            <div className='section-icon'>
              <ScanSearch size={21} />
            </div>

            <div>
              <span className='section-overline'>FIND YOUR FAVOURITE</span>
              <h3>Product Discovery</h3>
            </div>
          </div>

          <form onSubmit={onSubmitData} className='search-form'>
            <div className='search-input-wrapper'>
              <Search size={20} className='search-input-icon' />

              <input
                ref={inputRef}
                type='text'
                placeholder='Enter jewellery product code...'
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
              />

              {productCode && (
                <button
                  type='button'
                  className='input-clear'
                  onClick={() => setProductCode('')}
                  aria-label='Clear product code'
                >
                  <X size={17} />
                </button>
              )}
            </div>

            <button
              type='submit'
              className='luxury-search-button'
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle className='spin-animation' size={19} />
                  Searching
                </>
              ) : (
                <>
                  Search Product
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {error && (
            <div className='error-message'>
              <X size={17} />
              {error}
            </div>
          )}

          <div className='search-hint'>
            <ShieldCheck size={15} />
            Search using your jewellery product code
          </div>
        </div>

        {/* LOADING */}

        {loading && (
          <div className='loading-panel'>
            <LoaderCircle size={27} className='spin-animation' />
            <span>Discovering your jewellery...</span>
          </div>
        )}

        {/* PRODUCT RESULT */}

        {!loading && productData && (
          <section className='product-panel luxury-panel reveal-animation'>
            <div className='product-panel-header'>
              <div className='product-heading-icon'>
                <Gem size={22} />
              </div>

              <div>
                <span className='section-overline'>YOUR SELECTED PIECE</span>

                <h3>Product Details</h3>
              </div>

              <span className='product-code-badge'>#{productData.code}</span>
            </div>

            <div className='product-name-banner'>
              <span>ITEM NAME</span>
              <h2>{getValue(productData.data, 2)}</h2>
              <CircleCheck size={20} />
            </div>

            <div className='product-details-grid'>
              {[
                {
                  label: 'Gross Weight',
                  value: getValue(productData.data, 3),
                  unit: 'g',
                  icon: Weight,
                },
                {
                  label: 'Less Weight',
                  value: getValue(productData.data, 4),
                  unit: 'g',
                  icon: Weight,
                },
                {
                  label: 'Net Weight',
                  value: getValue(productData.data, 5),
                  unit: 'g',
                  icon: Gem,
                },
                {
                  label: 'Gold Rate',
                  value: getValue(productData.data, 6),
                  unit: 'INR',
                  icon: IndianRupee,
                },
                {
                  label: 'Hisaab',
                  value: getValue(productData.data, 7),
                  unit: '',
                  icon: Sparkles,
                },
                {
                  label: 'St / Oth',
                  value: getValue(productData.data, 8),
                  unit: '',
                  icon: Package,
                },
              ].map((item, index) => {
                const Icon = item.icon

                return (
                  <div
                    className='product-detail-card'
                    key={item.label}
                    style={{ '--item-index': index }}
                  >
                    <div className='detail-icon'>
                      <Icon size={18} />
                    </div>

                    <div className='detail-content'>
                      <span>{item.label}</span>
                      <strong>
                        {item.value}
                        {item.unit === 'g' && ' g'}
                        {item.unit === 'INR' && ' ₹'}
                      </strong>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className='product-price-section'>
              <div className='price-label'>
                <span>ESTIMATED PRODUCT VALUE</span>
                <small>Inclusive of calculated sheet values</small>
              </div>

              <div className='product-price'>
                {formatAmount(getAmount(getValue(productData.data, 9)))}
              </div>
            </div>

            <button
              type='button'
              className='add-cart-button'
              onClick={addToCart}
            >
              <Plus size={20} />
              Add to My Collection
              <ArrowRight size={18} />
            </button>
          </section>
        )}

        {/* CART */}

        <section className='cart-panel luxury-panel'>
          <div className='cart-header'>
            <div className='section-heading'>
              <div className='section-icon cart-heading-icon'>
                <ShoppingBag size={21} />
              </div>

              <div>
                <span className='section-overline'>
                  YOUR SELECTED JEWELLERY
                </span>
                <h3>My Collection</h3>
              </div>
            </div>

            <div className='cart-count'>
              <ShoppingBag size={16} />
              {totalItems} {totalItems === 1 ? 'ITEM' : 'ITEMS'}
            </div>
          </div>

          {cart.length === 0 ? (
            <div className='empty-cart'>
              <div className='empty-cart-art'>
                <ShoppingBag size={36} strokeWidth={1.2} />
                <Sparkles className='empty-sparkle' size={17} />
              </div>

              <h3>Your collection awaits</h3>

              <p>
                Search for your favourite jewellery and add it to your personal
                collection.
              </p>

              <span>
                <Gem size={14} />
                CURATED JUST FOR YOU
              </span>
            </div>
          ) : (
            <>
              <div className='cart-items'>
                {cart.map((item, index) => (
                  <div
                    className='cart-item reveal-animation'
                    key={item.code}
                    style={{ '--item-index': index }}
                  >
                    <div className='cart-item-symbol'>
                      <Gem size={22} strokeWidth={1.4} />
                    </div>

                    <div className='cart-item-info'>
                      <div className='cart-item-title'>
                        <h4>{item.name}</h4>
                        <span>#{item.code}</span>
                      </div>

                      <div className='cart-item-details'>
                        <span>
                          <Weight size={13} />
                          {item.netWeight} g
                        </span>

                        <span>
                          <Package size={13} />
                          Qty: {item.quantity}
                        </span>

                        <span>Rate: ₹{item.rate}</span>
                      </div>
                    </div>

                    <div className='cart-item-right'>
                      <strong>
                        {formatAmount(item.price * item.quantity)}
                      </strong>

                      <button
                        type='button'
                        className='remove-cart'
                        onClick={() => removeFromCart(item.code)}
                        title='Remove product'
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* SUMMARY */}

              <div className='cart-summary'>
                <div className='summary-heading'>
                  <div>
                    <span className='section-overline'>YOUR SELECTION</span>
                    <h3>Quotation Summary</h3>
                  </div>

                  <Gem size={25} />
                </div>

                <div className='summary-row'>
                  <span>Total Products</span>
                  <strong>{totalItems}</strong>
                </div>

                <div className='summary-row'>
                  <span>Total Net Weight</span>
                  <strong>{totalWeight.toFixed(3)} g</strong>
                </div>

                <div className='summary-divider'></div>

                <div className='grand-total'>
                  <div>
                    <span>GRAND TOTAL</span>
                    <small>Estimated quotation value</small>
                  </div>

                  <strong>{formatAmount(grandTotal)}</strong>
                </div>

                <button
                  type='button'
                  className='clear-cart-button'
                  onClick={() => setCart([])}
                >
                  <Trash2 size={16} />
                  Clear Collection
                </button>
              </div>
            </>
          )}
        </section>
      </section>

      {/* FOOTER */}

      <footer className='shringaar-footer'>
        <div className='footer-ornament'>
          <span></span>
          <Gem size={16} />
          <span></span>
        </div>

        <h3>SHRINGAAR</h3>

        <p>Every jewel tells a story. Make yours unforgettable.</p>

        <span className='footer-copyright'>
          A SPECIAL JEWELLERY EXHIBITION EXPERIENCE
        </span>
      </footer>
    </main>
  )
}

export default Home
